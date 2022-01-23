// pages/artists/artists.js
import { request } from "../../utils/request.js"
import { Pinyin } from "../../utils/ChinesePY.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        by: "",
        data: {},
        colors: ['#3280FC','#EA644A','#F1A325','#38B03F','#03B8CF','#BD7B46','#8666B8']
    },

    //获取艺人
    getArtistsOrAlbum(){
        if(this.data.by === 'artist'){
            request({
                url: "/getArtists",
                method: "GET"
            }).then((res) => {
                let keys = Object.keys(res.data).sort()
                res.data.keys = keys
                this.setData({
                    data: res.data
                })
            })
        }
        if(this.data.by === 'album'){
            request({
                url: "/getArtistAlbumMusic",
                method: "GET"
            }).then(res => {
                let temp = {}
                let data = res.data.data
                //根据首字母对艺人进行排序
                let artists = Pinyin.paixu(Object.keys(data))
                temp.keys = artists
                for(let artist of artists){
                    let albums = Pinyin.paixu(Object.keys(data[artist]))
                    temp[artist] = albums
                }
                this.setData({
                    data: temp
                })
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            by: options.by
        })
        this.getArtistsOrAlbum()
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
        this.getArtistsOrAlbum()
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