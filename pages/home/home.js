// pages/home/home.js
import { request } from "../../utils/request.js"

let app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        URL: app.globalData.URL,
        halfButtons: [
            {
                text: "取消",
                className: "half-button"
            },
            {
                text: "确定",
                className: "half-button"
            }
        ],
        form: {},
        showEditDialog: false
    },

    /**
     * 获取用户输入的个人资料
     */
    inputForm(e){
        let value = e.detail.value
        let name = e.target.dataset.name
        this.data.form[name] = value
        this.setData({
            form: this.data.form
        })
    },

    /**
     * 打开或关闭dialog
     */
    showEditDialog(e){
        if(!e){
            this.setData({
                showEditDialog: false
            })
            return 
        }else{
            this.setData({
                form: {
                    userName: this.data.userInfo.userName,
                    headImg: this.data.userInfo.headImg
                },
                showEditDialog: e.currentTarget.dataset.show
            })
        }
    },

    /**
     * 点击编辑资料弹窗按钮
     */
    buttonTap(e){
        let that = this
        //关闭弹窗
        if(e.detail.item.text === "取消"){
            this.showEditDialog(false)
        }else if(e.detail.item.text === "确定"){
            //上传了新头像
            //上传新头像到服务器
            if(this.data.form.uploadHeadImg){
                request({
                    filePath: that.data.form.headImg,
                    name: 'file',
                    url: "/updateUserHead"
                },"uploadFile").then(headImg => {
                    //更新页面绑定的头像数据
                    that.data.userInfo.headImg = that.data.URL+'/getPicByUrl?url='+headImg.data+'&comp=true'
                    that.setData({
                        userInfo: that.data.userInfo
                    })
                },(err) => {
                    wx.showToast({
                        title: '头像上传失败',
                        icon: "error"
                    })
                })
            }
            //调用修改用户名接口
            let user = {userName: that.data.form.userName}
            request({
                url: "/updateUser",
                method: "post",
                data: user
            }).then(res => {
                //更新页面绑定的数据
                that.data.userInfo.userName = user.userName
                that.setData({
                    userInfo: that.data.userInfo,
                    showEditDialog: false
                })
                wx.showToast({
                    title: '修改成功',
                    icon: "success"
                })
            })
        }
    },

    /**
     * 上传头像获取temppath
     */
    uploadHeadImg(){
        let that = this
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            success(res){
                that.data.form.headImg = res.tempFilePaths[0]
                that.data.form.uploadHeadImg = true
                that.setData({
                    form: that.data.form
                })
            }
        })
    },


    /**
     * 获取用户资料
     */
    getUserInfo(){
        request({
            url: '/userInfo',
            type: 'get'
        }).then( res => {
            res.data.headImg = this.data.URL+'/getPicByUrl?url='+res.data.headImg+'&comp=true'
            this.setData({
                userInfo: res.data
            })
        })
    },

    /**
     * 退出登录
     */
    logout(){
        wx.removeStorageSync('token')
        wx.reLaunch({
            url: "/pages/login/login"
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getUserInfo()
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
        this.getUserInfo()
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