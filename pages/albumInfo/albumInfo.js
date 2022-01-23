// pages/albumInfo/albumInfo.js
import { request } from "../../utils/request.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        photos:[],
        count:0,
        URL: getApp().globalData.URL,
        clientWidth: wx.getSystemInfoSync().windowWidth,
        nowPage: 1,
        pageSize: 18,
        type: null,
        typeName: "",
        types: [],//当前用户的相册列表  用于移动照片
        loadImages: 0,
        loading: false,
        o: null,
        lock: false,
        uploadingFlg: false,//是否处在上传状态
        uploadingCount: 0,//正在上传的图片
        allUploadCount: 0,//全部要上传的图片
        checkedImage: {}, //选中的图片
        deleteFlg: false, //删除状态
        showDeletePhotoDialog: false,//确认删除弹窗
        showMovePhotosDialog: false//移动照片弹窗
    },

    //获取页面图片
    getPhotos(){
        let _this = this
        //加载完图片才继续请求下一页的数据
        if(this.data.loading){
            this.data.o = setTimeout(function name() {
                _this.getPhotos()
            },1000)
            return
        }
        let url = `/getPhotos?page=${this.data.nowPage}&size=${this.data.pageSize}`
        if(this.data.type){
            url += '&type='+this.data.type
        }
        request({ 
            url: url,
            method: "GET"
        }).then((res) => {
            let newPhotos = _this.data.nowPage === 1 ? res.data.photos : _this.data.photos.concat(res.data.photos)
            _this.setData({
                photos: newPhotos,
                count: res.data.count,
                loadImages: res.data.photos.length,
                loading: res.data.photos.length
            })
            _this.data.nowPage++
        })
    },
    
    //监听图片加载进度
    loadImages(e){
        if(!--this.data.loadImages){
            this.setData({
                loading: false
            })
        }
    },

    //查看大图
    bigImage(e,passLock){
        //检查锁
        if (this.data.lock && !passLock) {
            return
        }
        if(this.data.deleteFlg){
            //处于删除状态，点击选中图片
            let id = "s"+e.currentTarget.dataset.photo.id
            let path = e.currentTarget.dataset.photo.path + e.currentTarget.dataset.photo.fileName
            if(this.data.checkedImage[id]){
                //取消选中
                delete this.data.checkedImage[id]
                this.setData({
                    checkedImage: this.data.checkedImage
                })
            }else{
                //选中
                this.data.checkedImage[id] = path
                this.setData({
                    checkedImage: this.data.checkedImage
                })
            }
        }else{
            //非删除状态,点击查看大图
            let bigImageUrl = e.currentTarget.dataset.photo ? this.data.URL+"/getPicByUrl?url="+e.currentTarget.dataset.photo.path+e.currentTarget.dataset.photo.fileName : ""
            //查看大图
            wx.previewMedia({
                sources:[
                    {
                        url: bigImageUrl
                    }
                ]
            })
            return
        }
    },

    //以下两个方法用于解决长按触发tap事件
    //大图长按
    imgLongTap(e){
        //锁住
        this.setData({lock: true})
        this.checkPhoto()
        this.bigImage(e,true)
    },
    //大图长按结束
    imgLongTouched(){
        if (this.data.lock) {
            //开锁
            setTimeout(() => {
              this.setData({ lock: false })
            }, 100);
          }
    },

    //点击右上删除照片按钮开始选择照片
    checkPhoto(){
        this.setData({
            deleteFlg: !this.data.deleteFlg
        })
        if(!this.data.deleteFlg){
            this.setData({
                checkedImage: {}
            })
        }
    },

    //确认删除照片
    deletePhoto(e){
        let _this = this
        let values = Object.values(this.data.checkedImage)
        if(!values.length){
            wx.showToast({
                title: "请选择照片",
                icon: "error"
            })
            return
        }
        if(!e.detail.item){
            //点击删除弹出确认弹窗
            this.setData({
                showDeletePhotoDialog: true
            })
            return
        }
        if(e.detail.item.text === "确定"){
            //确认弹窗点击确定
            //获取需要删除的图片的文件名数组作为接口参数
            request({
                url: "/deletePhotos",
                method: "POST",
                data: values
            }).then((res) => {
                //删除后刷新页面
                _this.setData({
                    photos: [],
                    nowPage: 1,
                    deleteFlg: false,
                    showDeletePhotoDialog: false
                })
                _this.getPhotos()
                wx.showToast({
                    title: res.data,
                    icon: "success"
                })
            })
        }else if(e.detail.item.text === "取消"){
            //确认弹窗点击取消
            this.setData({
                showDeletePhotoDialog: false
            })
        }
    },

    //上传照片
    addPhoto(){
        let _this = this
        wx.chooseImage({
          sourceType: ['album', 'camera'],
          success:(res) => {
            let files = res.tempFilePaths
            _this.setData({
                uploadingFlg: true,
                uploadingCount: 0,
                allUploadCount: files.length
            })
            for(let file of files){
                request({
                    filePath: file,
                    name: 'file',
                    url: "/uploadPic",
                    formData: {
                        type: _this.data.type
                    }
                },"uploadFile").then((res) => {
                    _this.setData({
                        uploadingCount: ++_this.data.uploadingCount,
                    })
                    if(_this.data.uploadingCount === files.length){
                        wx.showToast({
                            title: '上传完成',
                            icon: "success"
                        })
                        _this.setData({
                            photos: [],
                            nowPage: 1,
                            uploadingFlg: false
                        })
                        _this.getPhotos()
                    }
                },(err) => {
                    wx.showToast({
                        title: '上传失败',
                        icon: "error"
                    })
                })
            }
          }
        })
    },

    //移动照片到其他相册弹窗
    movePhotosDialog(e){
        let _this = this
        //弹出相册列表选择要移动的目标相册
        request({
            url: "/getTypesOfUser",
            method: "GET"
        }).then((res) => {
            let types = []
            for(let type of res.data){
                if(type.id != _this.data.type){
                    types.push({
                        text: type.name,
                        value: type.id
                    })
                }
            }
            _this.setData({
                types: types,
                showMovePhotosDialog: true
            })
        })
    },

    //移动照片
    movePhotos(e){
        let _this = this
        //获取要移动到目标相册
        let type = e.detail.value
        let fileNames = []
        let keys = Object.keys(this.data.checkedImage)
        for(let key of keys){
            fileNames.push(this.data.checkedImage[key].split("/")[this.data.checkedImage[key].split("/").length-1])
        }
        request({
            url: "/movePhotos?type="+type,
            method: "POST",
            data:fileNames
        }).then((res) => {
            wx.showToast({
                title: res.data,
                icon: "success"
              })
              _this.setData({
                  showMovePhotosDialog: false
              })
              _this.onPullDownRefresh()
        })
    },

    //下载图片
    downloadPhotos(){
        let keys = Object.keys(this.data.checkedImage)
        for(let key of keys){
            let path = this.data.URL+"/getPicByUrl?url="+this.data.checkedImage[key]
            wx.getImageInfo({
                src: path,
                success(res){
                    wx.saveImageToPhotosAlbum({
                        filePath: res.path,
                        success(){
                            wx.showToast({
                              title: '保存成功',
                              icon: "success"
                            })
                        }
                    })
                }
            })
        }
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            type: options['type'] == 'null' ? null : options['type'],
            typeName: options['typeName']
        })
        this.getPhotos()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.setData({
            photos:[],
            nowPage: 1,
            count: 0
        })
        this.getPhotos()
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.getPhotos()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})