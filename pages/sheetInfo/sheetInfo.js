// pages/sheetInfo/sheetInfo.js
import {
    request
} from "../../utils/request.js"
let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        clientWidth: wx.getSystemInfoSync().windowWidth,
        URL: getApp().globalData.URL,
        sheet: {},
        musics: [],
        count: 0,
        editFlg: false,
        inputName: "",
        backColor: {},
        showMenu: false,
        checkMusicsFlg: false,
        checkAllMusicFlg: false,//是否处在全选状态
        showDeleteMusicsDialog: false,
        sheets: [],
        uploadingFlg: false, //是否正在上传
        page:{
            page: 1,
            size: 10
        }
    },

    //进入编辑模式
    edit() {
        if (this.data.editFlg) {
            //编辑模式完成
            let oldName = this.data.sheet.sheetName
            let oldId = this.data.sheet.id
            if (oldName !== this.data.inputName) {
                request({
                    url: "/updateSheet?newName=" + this.data.inputName + "&oldId=" + oldId,
                    method: "GET"
                }).then((res) => {
                    if(res.data.includes('成功')){
                        wx.showToast({
                            title: res.data,
                            icon: "success"
                        })
                        this.data.sheet.sheetName = this.data.inputName
                        this.setData({
                            sheet: this.data.sheet
                        })
                    }else{
                        wx.showToast({
                            title: res.data,
                            icon: "error"
                        })
                    }
                })
            }
        }else{
            this.setData({
                inputName: this.data.sheet.sheetName
            })
        }
        this.setData({
            editFlg: !this.data.editFlg
        })
    },

    inputName(e) {
        this.setData({
            inputName: e.detail.value
        })
    },

    //根据歌单获取当前页的数据
    getMusics(page) {
        let _this = this
        page = typeof(page) === "number" ? page : null
        //重新获取当前歌单的信息
        let url = "/getSheet?sheetId=" + this.data.sheet.id
        if (this.data.sheet.id === -1) {
            url = "/getSheetOfAllMusic"
        }
        request({
            url: url,
            method: "GET"
        }).then((res) => {
            let sheet = res.data
            this.setData({
                sheet: sheet,
                page:{
                    page: page || _this.data.page.page,
                    size: _this.data.page.size
                }
            })
            //重新获取当前歌单的音乐列表
            request({
                url: "/getList",
                data: {
                    search:{
                        sheet: sheet.id
                    },
                    page: {
                        page: _this.data.page.page,
                        size: _this.data.page.size
                    }
                },
                method: "POST"
            }).then((res) => {
                _this.setData({
                    musics: _this.data.page.page === 1 ? res.data.data : _this.data.musics.concat(res.data.data),
                    count: res.data.count
                })
                if(res.data.data.length){
                    _this.data.page.page++
                }
            })
        })
    },

    //修改歌单封面
    changeCoverImg() {
        let _this = this
        if (!this.data.editFlg) {
            //如果不处在编辑模式下则没有动作
            return
        }
        //选择一张图片
        wx.chooseImage({
            count: 1,
            sourceType: ['album', 'camera'],
            success(res) {
                //上传图片到服务器
                let tempPath = res.tempFilePaths[0]
                request({
                    filePath: tempPath,
                    name: 'file',
                    url: "/uploadPic"
                }, 'uploadFile').then((res) => {
                    //重新渲染图片
                    _this.data.sheet.coverImg = res.data
                    _this.setData({
                        sheet: _this.data.sheet
                    })
                    request({
                        url: "/album/saveSheet",
                        method: "post",
                        data: _this.data.sheet
                    })
                    wx.showToast({
                        title: '上传成功',
                        icon: "success"
                    })
                })
            }
        })
    },

    //进入选择状态
    checkMusics(e) {
        for (let i in this.data.musics) {
            if (this.data.musics[i].checked) {
                this.data.musics[i].checked = false
            }
        }
        this.setData({
            checkMusicsFlg: !this.data.checkMusicsFlg,
            musics: this.data.musics
        })
    },
    //点击选择音乐
    checkMusics2(e) {
        let musics = this.data.musics
        let checkMusic = e.detail.music
        for (let music of musics) {
            if (music.id === checkMusic.id) {
                musics[musics.indexOf(music)].checked = !musics[musics.indexOf(music)].checked
            }
        }
        this.setData({
            musics: musics
        })
    },
    //全选
    checkAllMusic(){
        this.setData({
            checkAllMusicFlg: !this.data.checkAllMusicFlg
        })
        if(this.data.checkAllMusicFlg){
            //全选
            let musics = this.data.musics
            for (let music of musics) {
                music.checked = true
            }
            this.setData({
                musics: musics
            })
        }else{
            //全不选
            let musics = this.data.musics
            for (let music of musics) {
                music.checked = false
            }
            this.setData({
                musics: musics
            })
        }
    },

    //播放音乐
    playMusic(e) {
        if (e.currentTarget.dataset.name === "播放") {
            if(!this.data.musics.length){
                return
            }
            app.globalData.audio.playList = this.data.musics
        } else {
            //播放点击的歌曲
            let music = e.detail.music
            let musics = [...this.data.musics]
            for(let i in musics){
                let item = musics[i]
                if(item.id === music.id){
                    app.globalData.audio.playList = musics.splice(i)
                    break
                }
            }
        }
        app.globalData.audio.start()
    },

    //长按进入选择状态
    musicLongTap(e) {
        this.setData({
            checkMusicsFlg: true
        })
        this.checkMusics2(e)
    },

    //删除歌曲
    deleteMusic(musics) {
        if (!musics.length) {
            return
        }
        request({
            url: "/deleteMusics",
            method: "POST",
            data: musics,
        }).then(() => {
            this.getMusics(1)
            wx.showToast({
                title: '删除成功',
                icon: "success"
            })
        })
    },

    //点击删除弹窗确认
    showDeleteMusicsDialog() {
        this.setData({
            showDeleteMusicsDialog: true
        })
    },

    //删除选中的歌曲
    deleteCheckMusics(e) {
        if (e.detail.item.text === "确定") {
            let checkMusics = []
            for (let music of this.data.musics) {
                if (music.checked) {
                    checkMusics.push(music)
                }
            }
            this.deleteMusic(checkMusics)
        }
        this.setData({
            showDeleteMusicsDialog: false
        })
    },

    //歌曲添加到歌单
    addToSheet(musics, sheet) {
        if (!musics.length) {
            return
        }
        request({
            url: "/addMusicToSheet?sheet=" + sheet,
            method: "POST",
            data: musics
        }).then(() => {
            wx.showToast({
                title: '添加成功',
                icon: "success"
            })
        })
    },

    //弹出歌单菜单
    showMenu() {
        let that = this
        //请求获得用户歌单列表
        request({
            url: "/getSheets",
            method: "GET"
        }).then((res) => {
            let tempSheets = []
            for (let sheet of res.data) {
                //不可添加到当前歌单
                if (sheet.id === that.data.sheet.id) {
                    continue
                }
                tempSheets.push({
                    text: sheet.sheetName,
                    value: sheet.id
                })
            }
            that.setData({
                sheets: tempSheets
            })
        })
        this.setData({
            showMenu: true
        })
    },

    //点击添加到歌单
    cilckOption(e) {
        let sheet = e.detail.value
        let checkMusics = []
        for (let music of this.data.musics) {
            if (music.checked) {
                checkMusics.push(music)
            }
        }
        this.addToSheet(checkMusics, sheet)
        this.setData({
            showMenu: false
        })
    },

    //上传音乐
    uploadMusic() {
        let that = this
        //从聊天记录选取文件
        wx.chooseMessageFile({
            count: 9,
            type: "file",
            extension: ['flac', 'mp3'],
            success(res) {
                that.setData({
                    uploadingFlg: true
                })
                let files = res.tempFiles
                let num = 0
                //调用上传接口上传音乐文件
                for (let file of files) {
                    request({
                        url: "/uploadMusic",
                        filePath: file.path,
                        name: "file"
                    }, "uploadFile").then((res) => {
                        if (++num === files.length) {
                            //上传完成
                            that.getMusics(1)
                            wx.showToast({
                                title: res.data,
                                icon: "none"
                            })
                            that.setData({
                                uploadingFlg: false
                            })
                        }
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            sheet: {
                id: parseInt(options.sheetId)
            }
        })
        this.getMusics()
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
        this.getMusics(1)
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