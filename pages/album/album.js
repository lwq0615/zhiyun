// pages/album/album.js
import { request } from "../../utils/request.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        URL:getApp().globalData.URL,
        clientWidth: wx.getSystemInfoSync().windowWidth,
        albums:[],
        showAddAlbumDialog: false,
        inputName: "",
        deleteFlg: false,
        showDeleteAlbumDialog: false,
        checkAlbum: ""
    },

    //初始化
    init() {
        let _this = this
        request({
          url: '/getTypeAndPic',
          method: "GET"
        }).then((res) => {
            _this.setData({
                albums: res.data
              })
        })
    },

    //点击进入相册或者点击删除相册
    albumInfo(e){
        this.setData({
            checkAlbum: e.currentTarget.dataset.album.id
        })
        if(this.data.deleteFlg){
            //点击删除相册
            if(this.data.checkAlbum){
                this.setData({
                    showDeleteAlbumDialog: true
                })
            }else{
                wx.showToast({
                    title: "该相册无法删除",
                    icon: "error"
                })
            }
        }else{
            //点击进入相册
            wx.navigateTo({
                url: `/pages/albumInfo/albumInfo?type=${this.data.checkAlbum}&typeName=${e.currentTarget.dataset.album.name}`
            })
        }
    },

    //删除相册按钮确认
    deleteAlbum(e){
        let _this = this
        if(e.detail.item.text === "确定"){
            //点击确定按钮
            request({
                url: "/deleteTypes",
                method: "POST",
                data:[_this.data.checkAlbum]
            }).then((res) => {
                wx.showToast({
                    title: res.data,
                    icon: "success"
                })
                _this.selectComponent("#showDeleteAlbumDialog").close()
                _this.init()
            })
        }else{
            //点击取消按钮
            this.selectComponent("#showDeleteAlbumDialog").close()
        }
    },

    //新建相册
    addAlbum(){
        this.setData({
            showAddAlbumDialog: true
        })
    },

    //获取input输入框的值
    inputName(e){
        this.setData({
            inputName: e.detail.value
        })
    },

    //点击新建相册按钮确认
    buttontap(e){
        let _this = this
        if(e.detail.item.text === "确定"){
            //点击确定按钮
            let name = this.data.inputName
            if(!name){
                wx.showToast({
                    title: "名称不可为空",
                    icon: "error"
                })
                return
            }
            request({
                url: `/createType?newTypeNm=${name}`,
                method: "GET"
            }).then((res) => {
                wx.showToast({
                    title: res.data,
                    icon: res.data.indexOf("成功") !== -1 ? "success" : "error"
                })
                if(res.data.indexOf("成功") !== -1){
                    _this.selectComponent("#showAddAlbumDialog").close()
                    _this.init()
                }
            })
        }else{
            //点击取消按钮
            this.selectComponent("#showAddAlbumDialog").close()
        }
    },

    //关闭dialog触发事件清除input输入框内容
    colseDialog(){
        this.setData({
            inputName: "",
            showAddAlbumDialog: false
        })
    },

    //删除相册
    dleteAlbum(){
        this.setData({
            deleteFlg: !this.data.deleteFlg
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        this.init()
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
        this.init()
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})