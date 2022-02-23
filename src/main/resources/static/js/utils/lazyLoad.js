/**
 * 需要懒加载时引入该js文件
 * @param dom 存放图片的滚动元素（尽量使用最接近图片的一层,且必须为定位元素）
 * @param imgs 需要懒加载的图片，不能设置src属性，将请求地址设置为data-src属性
 */
function lazyLoad(dom,imgs){

    let o = null

    let loadImg = function () { 
        //onscroll()在滚动条滚动的时候触发
        //offsetTop是元素与offsetParent的距离，循环获取直到页面顶部
        //获取元素到body顶部的距离，包括所有被滚动的父元素高度
        function getTop(e) {
            var T = e.offsetTop;
            while((e = e.offsetParent) && e !== dom) {
                T += e.offsetTop;
            }
            return T;
        }

        function lazyLoad(imgs) {
            //节流
            if(!o){
                o = setTimeout(function () {
                    var H = dom.clientHeight;//获取元素可视区域高度
                    var S = dom.scrollTop; //元素滚动条偏移量
                    for (var i = 0; i < imgs.length; i++) {
                        if (H+S > getTop(imgs[i])) {
                            imgs[i].src = imgs[i].getAttribute('data-src');
                        }
                    }
                    o = null
                },100)
            }
        }
        lazyLoad(imgs);
    }

    dom.onscroll = loadImg
    loadImg()
}