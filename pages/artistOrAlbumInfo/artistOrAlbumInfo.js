// pages/artistOrAlbumInfo/artistOrAlbumInfo.js
import { request } from "../../utils/request.js"
let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        URL: getApp().globalData.URL,
        artist: "",
        album: "",
        musics: [],
        count: 0,
        page: {
            page: 1,
            size: 10
        }
    },

    //获取页面数据
    getMusics(page){
        let _this = this
        page = typeof(page) === "number" ? page : null
        this.setData({
            page: {
                page: page || _this.data.page.page,
                size: _this.data.page.size
            }
        })
        let data = {
            search: {
                sheet: -1
            },
            page: _this.data.page
        }
        if(this.data.artist){
            data.search.artist = this.data.artist
        }
        if(this.data.album){
            data.search.album = this.data.album
        }
        request({
            url: "/getList",
            method: "POST",
            data: data
        }).then((res) => {
            _this.setData({
                musics: _this.data.page.page === 1 ? res.data.data : _this.data.musics.concat(res.data.data),
                count: res.data.count
            })
            if(res.data.data.length){
                _this.data.page.page++
            }
        })
    },

    //播放音乐
    playMusic(e) {
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
        app.globalData.audio.start()
    },
    

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.artist){
            this.setData({
                artist: options.artist
            })
        }
        if(options.album){
            this.setData({
                album: options.album
            })
        }
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