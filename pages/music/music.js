// pages/music/music.js
import { request } from "../../utils/request.js"
let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        clientWidth: wx.getSystemInfoSync().windowWidth,
        URL: getApp().globalData.URL,
        showHalf: false,
        pauseSrc: "/image/play.png",
        coverImg: "",
        name: "未在播放",
        playList: [],
        progress: 0,
        moveProgressLock: false
    },

    //拖动进度条
    moveProgress(e){
        if(!app.globalData.audio.playing){
            return
        }
        if(typeof(e) === "number"){
            //如果处在进度条拖动中的状态,则不由总控制器控制进度
            if(!this.data.moveProgressLock){
                this.setData({
                    progress: e
                })
            }
            return
        }
        this.setData({
            moveProgressLock: true
        })
        //进度条宽度
        //转换为单位px
        let proWidth = wx.getSystemInfoSync().windowWidth/720*600
        //进度条偏移量，单位px
        let move = Math.floor(e.touches[0].pageX-wx.getSystemInfoSync().windowWidth/720*60) < 0 ? 0 : Math.floor(e.touches[0].pageX-wx.getSystemInfoSync().windowWidth/720*60)
        this.setData({
            progress: Math.floor(move/proWidth*100) > 100 ? 100 : Math.floor(move/proWidth*100)
        })
    },
    //松开拖动改变播放进度
    changeProgress(){
        //松开拖动结束拖动状态
        this.setData({
            moveProgressLock: false
        })
        //改变播放进度
        app.globalData.audio.changeProgress(this.data.progress)
    },

    //获取用户所有歌单
    showSheets(){
        wx.navigateTo({
            url: `/pages/sheets/sheets`
        })
    },

    //点击歌曲进入歌单
    sheetInfo(){
        request({
            url: "/getSheetOfAllMusic",
            method: "GET"
        }).then((res) => {
            let id = res.data.id
            wx.navigateTo({
                url: `/pages/sheetInfo/sheetInfo?sheetId=${id}`
            })
        })
    },

    //点击艺人展示艺人列表
    showArtists(){
        wx.navigateTo({
            url: `/pages/artistsOrAlbum/artistsOrAlbum?by=artist`
        })
    },

    //点击专辑展示专辑列表
    showAlbums(){
        wx.navigateTo({
            url: `/pages/artistsOrAlbum/artistsOrAlbum?by=album`
        })
    },

    //点击播放下一首
    nextMusic(){
        app.globalData.audio.next()
    },

    //播放或者暂停
    playAndPause(){
        if(app.globalData.audio.control.paused){
            app.globalData.audio.play() ? this.setData({pauseSrc: "/image/pause.png"}) : null
        }else{
            app.globalData.audio.pause() ? this.setData({pauseSrc: "/image/play.png"}) : null
        }
    },

    //展示播放列表
    showDialog(){
        this.setData({
            showHalf: true
        })
    },

    //更新控制台封面等信息
    //每次播放一首新的歌曲时触发
    updateControl(){
        //更新播放列表信息
        this.setData({
            playList: app.globalData.audio.playList.slice(1),
            progress: 0
        })
        if(app.globalData.audio.playList.length){
            //播放列表不为空
            this.setData({
                coverImg: app.globalData.URL+"/getPicByUrl?url="+app.globalData.audio.playList[0].coverPath+"&comp=true",
                name: app.globalData.audio.playList[0].name,
                pauseSrc: "/image/pause.png"
            })
        }else{
            //播放列表为空，播放结束
            this.setData({
                coverImg: "",
                name: "未在播放",
                pauseSrc: "/image/play.png"
            })
        }
    },

    //控制台点击播放列表中音乐切歌
    playMusic(e){
        let music = e.detail.music
        for(let i in app.globalData.audio.playList){
            let item = app.globalData.audio.playList[i]
            if(item.id === music.id){
                app.globalData.audio.playIndex(i)
            }
        }
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