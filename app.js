// app.js
let URL = "http://localhost:8080"


import {
  request
} from "./utils/request.js"
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    //本地测试地址
    URL: URL,
    audio: {
      control: wx.createInnerAudioContext({useWebAudioImplement: true}),
      //播放列表
      playList: [],
      playing: false,
      //下一首
      next(){
        if(!this.playList.length){
          return
        }
        this.playList.splice(0,1)
        return this.start()
      },
      //播放列表第一首
      start(){
        let that = this
        let musicPage = null
        this.control.stop()
        //动态更新music页面的控制台信息
        for(let item of getCurrentPages()){
          if(item.route === "pages/music/music"){
            musicPage = item
            break
          }
        }
        musicPage.updateControl()
        if(!this.playList.length){
          this.playing = false
          return null
        }
        this.playing = true
        let src = URL+"/getMusic?path="+this.playList[0].path+this.playList[0].fileName
        this.control.src = src
        this.control.play()
        //播放次数加一
        request({
            url: "/addCount?id=" + this.playList[0].id,
            method: "GET"
        })
        //自动播放下一首
        this.control.onEnded(function(){
          that.next()
        })
        //音频播放中改变进度条进度
        this.control.onTimeUpdate(function(){
          //音频的总时长，单位秒
          let allTime = parseInt(that.playList[0].time.split(":")[0])*60 + parseInt(that.playList[0].time.split(":")[1])
          //音频已播放时长，单位秒
          let nowTime = that.control.currentTime
          let progress = Math.floor(nowTime/allTime*100)
          //动态更新music页面的控制台进度条
          musicPage.moveProgress(progress)
        })
        return this.playList[0]
      },
      //暂停播放
      pause(){
        if(!this.playing){
          return false
        }
        this.control.pause()
        return true
      },
      //开始播放
      play(){
        if(!this.playing){
          return
        }
        this.control.play()
        return true
      },
      //切歌
      //index为播放列表中歌曲下标
      playIndex(index){
        this.playList.splice(0,index)
        this.start()
      },
      //更改当前歌曲播放进度
      changeProgress(progress){
        //音频的总时长，单位秒
        let allTime = parseInt(this.playList[0].time.split(":")[0])*60 + parseInt(this.playList[0].time.split(":")[1])
        let pause = this.control.paused
        this.control.stop()
        this.control.seek(allTime*progress*0.01)
        pause ? null : this.control.play()
      }
    }
  }
})
