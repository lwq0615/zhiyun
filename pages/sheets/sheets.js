// pages/sheets/sheets.js
import { request } from "../../utils/request.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        clientWidth: wx.getSystemInfoSync().windowWidth,
        URL: getApp().globalData.URL,
        sheets: [],
        showAddSheetDialog: false,
        inputName: '',
        showDeleteSheetDialog: false,
        deleteSheet: {}
    },

    showSheets(){
        let _this = this
        request({
            url: "/getSheetsInfo",
            method: "GET"
        }).then((res) => {
            _this.setData({
                sheets: res.data
            })
        }
        )
    },

    //新建歌单
    addSheet(){
        this.setData({
            showAddSheetDialog: true,
            inputName: ""
        })
    },

    //点击进入歌单
    sheetInfo(e){
        let id = e.currentTarget.dataset.sheet.id
        wx.navigateTo({
            url: `/pages/sheetInfo/sheetInfo?sheetId=${id}`
        })
    },


    //获取input输入框的值
    inputName(e){
        this.setData({
            inputName: e.detail.value
        })
    },

    //点击新建按钮确认
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
                url: "/addSheet?name="+name,
                method: "GET"
            }).then((res) => {
                wx.showToast({
                    title: res.data,
                    icon: res.data.includes('成功') ? 'success' : 'error'
                  })
                  _this.showSheets()
                  _this.setData({
                      showAddSheetDialog: false
                  })
            })
        }else{
            //点击取消按钮
            this.setData({
                showAddSheetDialog: false
            })
        }
    },


    //删除歌单弹窗
    deleteSheet(e){
        this.setData({
            showDeleteSheetDialog: true,
            deleteSheet: e.currentTarget.dataset.sheet
        })
    },

     //删除歌单
     deleteSheet2(e){
        let _this = this
        if(e.detail.item && e.detail.item.text === "确定"){
            request({
                url: "/deleteSheet?sheet="+this.data.deleteSheet.id,
                method: "DELETE"
            }).then(() => {
                _this.showSheets()
                wx.showToast({
                  title: '删除成功',
                  icon: "success"
                })
            })
        }
        this.setData({
            showDeleteSheetDialog: false
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
        this.showSheets()
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
        this.showSheets()
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