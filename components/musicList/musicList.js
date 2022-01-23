Component({
    properties: {
        musics: {
            // 列表中的音乐
            type: Array,
            value: []
        },
        count: {
            type:Number,
            value: 0
        },
        height: {
            type: Number,
            value: null
        }
    },
    data:{
        clientWidth: wx.getSystemInfoSync().windowWidth,
        lock: false,
        URL: getApp().globalData.URL
    },

    methods: {

        //点击列表中音乐
        musicTap(e) {
            //检查锁
            if (this.data.lock) {
                return
            }
            this.triggerEvent('musicTap', e.currentTarget.dataset);
        },

        //松开列表中音乐
        musicTouched(e){
            if (this.data.lock) {
                //开锁
                setTimeout(() => {
                    this.setData({
                        lock: false
                    })
                }, 100);
            }
        },

        //长按列表中音乐
        musicLongTap(e){
            //锁住
            this.setData({
                lock: true
            })
            this.triggerEvent('musicLongTap', e.currentTarget.dataset);
        },

        //触底刷新
        scrolltolower(){
            this.triggerEvent('scrolltolower');
        }

    }
});