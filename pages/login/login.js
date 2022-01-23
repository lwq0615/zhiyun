// pages/login/login.js
import { request } from "../../utils/request.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        clientWidth: wx.getSystemInfoSync().windowWidth,
        loginOrZhuce: 0,
        yzCode: ''
    },


    //用户登录
    login(data) {
        let username = data.detail.value.username
        let password = data.detail.value.password
        if(!username || !password){
            wx.showToast({
              title: '请输入用户信息',
              icon: "error"
            })
            return
        }
        request({
          url: "/login",
          method: "POST",
          data:{
              userId:username,
              password:password
          }
        }).then((res) => {
            if(res.data.includes("错误")){
                wx.showToast({
                    title: res.data,
                    icon: "error"
                })
            }else{
                wx.removeStorageSync('token')
                wx.setStorageSync('token', res.data)
                wx.switchTab({
                    url: "/pages/home/home"
                })
            }
        })
    },

    /**
     * 注册
     */
    zhuce(e){
        let username = e.detail.value.username
        let password = e.detail.value.password
        let password2 = e.detail.value.password2
        let yzCode = e.detail.value.yzm
        let phoneReg = /^1[3456789]\d{9}$/
        let passwdReg = /^[0-9]*$/
        if(!username || !password || !password2){
            wx.showToast({
                title: "请填写完整",
                icon: "none"
            })
            return 
        }
        if(this.data.yzCode.toLowerCase() !== yzCode.toLowerCase()){
            wx.showToast({
                title: "验证码错误",
                icon: "none"
            })
            return 
        }
        if(password !== password2){
            wx.showToast({
                title: "两次密码不一致",
                icon: "none"
            })
            return 
        }
        if(!phoneReg.test(username)){
            wx.showToast({
                title: "请输入正确的手机号",
                icon: "none"
            })
            return 
        }
        if(passwdReg.test(password)){
            wx.showToast({
                title: "密码应为八位以上非纯数字组合",
                icon: "none"
            })
            return 
        }
        request({
            url: "/register",
            method: "post",
            data: {
                userId: username,
                password: password
            }
        }).then(res => {
            wx.showToast({
                title: res.data,
                icon: res.data === "注册成功" ? "success" : "error"
            })
            if(res.data === "注册成功"){
                this.toLogin()
            }
        })
    },

    /**
     * 点击去登录
     */
    toLogin(){
        this.setData({
            loginOrZhuce: 0
        })
    },

    /**
     * 点击去注册
     */
    toZhuce(){
        this.setData({
            loginOrZhuce: 1
        })
        this.loadYzm()
    },

    loadYzm(){
        let that = this
        const query = wx.createSelectorQuery()
        query.select('#yzm')
        .fields({ node: true, size: true })
        .exec((res) => {
            const canvas = res[0].node
            that.setData({
                yzmCanvas: canvas
            })
            const ctx = canvas.getContext('2d')
            const dpr = wx.getSystemInfoSync().pixelRatio
            canvas.width = res[0].width * dpr
            canvas.height = res[0].height * dpr
            ctx.scale(dpr, dpr)
            ctx.fillStyle = "rgb(252,250,239)"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            //生成线条
            for(let i=0;i<4;i++){
                let x1 = Math.floor(Math.random()*canvas.width/dpr);
                let y1 = Math.floor(Math.random()*canvas.height/dpr);
                let x2 = Math.floor(Math.random()*canvas.width/dpr);
                let y2 = Math.floor(Math.random()*canvas.height/dpr);
                ctx.beginPath()
                ctx.moveTo(x1,y1)
                ctx.lineTo(x2,y2)
                ctx.closePath()
                ctx.strokeStyle = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`
                ctx.stroke()
            }
            //生成验证码串
            let codeStr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            that.data.yzCode = '';
            // 验证码有几位就循环几次
            for (let i = 0; i < 4; i++) {
                //生成0-62的随机数
                let ran = Math.floor(Math.random()*62);
                that.data.yzCode += codeStr[ran];
                ctx.fillStyle = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`
                ctx.font = "30px 微软雅黑"
                ctx.fillText(codeStr[ran],10+i*20,35)
            }
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