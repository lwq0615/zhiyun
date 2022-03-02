//上传音乐
function uploadMusic() {
    document.getElementById("msg").innerText = "正在上传..."
    let files = document.getElementById("fileUpload").files
    if(!files.length){
        return
    }
    let num = 0
    for(let file of files){
        let data = new FormData()
        data.append("file",file)
        request({
            url:`/uploadMusic`,
            type:"post",
            data:data,
            contentType: false,
            processData: false
        }).then(res => {
            if(++num === files.length){
                new $.zui.Messager(res, {
                    type: res === "上传成功" ? "primary" : "warning" // 定义颜色主题
                }).show();
                getListBySheet(nowSheet,nowSearchName)
                document.getElementById("msg").innerText = ""
                document.getElementById("fileUpload").value = ""
            }
        })
    }
}

//音量进度条
let bar = document.getElementById("bar")
let barBtn = document.getElementById("barBtn")
let barCheck = document.getElementById("barCheck")
let audio = document.getElementById("audio")
//音量百分比
let volume = 1
barCheck.style.width = window.getComputedStyle(bar).width.replace(/[A-Za-z]/ig,"")*1-14+"px"
//点击改变音量
bar.onclick = function(e){
    let barWidth = window.getComputedStyle(bar).width.replace(/[A-Za-z]/ig,"")*1
    if(e.clientX-barCheck.offsetLeft < barWidth-14){
        barCheck.style.width = e.clientX-barCheck.offsetLeft+"px"
        volume = ((e.clientX-barCheck.offsetLeft)/(barWidth-14)).toFixed(2)*1
    }else{
        barCheck.style.width = barWidth-14+"px"
        volume = 1
    }
    audio.volume = volume
}
barBtn.onclick = function(e){
    e.stopPropagation()
}
//滑动改变音量
barBtn.onmousedown = function (ev) {
    //点击时选中部分的宽度
    let barCheckWidth = window.getComputedStyle(barCheck).width.replace(/[A-Za-z]/ig,"")*1
    let barWidth = window.getComputedStyle(bar).width.replace(/[A-Za-z]/ig,"")*1
    window.onmousemove = function(e){
        if(barCheckWidth+e.clientX-ev.clientX+14 < barWidth){
            barCheck.style.width = barCheckWidth+e.clientX-ev.clientX+"px"
        }else{
            barCheck.style.width = barWidth-14+"px"
        }
        volume = (barCheck.style.width.replace(/[A-Za-z]/ig,"")*1/(barWidth-14)).toFixed(2)*1
        audio.volume = volume
    }
    window.onmouseup = function () {
        window.onmousemove = function () {
            return false
        }
    }
}


//播放进度条
let bar2 = document.getElementById("bar2")
let barBtn2 = document.getElementById("barBtn2")
let barCheck2 = document.getElementById("barCheck2")
//播放百分比
let progress = 1
//点击改变播放进度
bar2.onclick = function(e){
    if(audio.src){
        let bar2Width = window.getComputedStyle(bar2).width.replace(/[A-Za-z]/ig,"")*1
        if(e.offsetX-barCheck2.offsetLeft < bar2Width-14){
            barCheck2.style.width = e.offsetX-barCheck2.offsetLeft+"px"
            progress = ((e.offsetX-barCheck2.offsetLeft)/(bar2Width-14)).toFixed(2)*1
        }else{
            barCheck2.style.width = bar2Width-14+"px"
            progress = 1
        }
        audio.currentTime = audio.duration*progress
    }
}
barBtn2.onclick = function(e){
    e.stopPropagation()
}
//滑动改变播放进度
barBtn2.onmousedown = function (ev) {
    if(audio.src){
        //点击时选中部分的宽度
        let barCheck2Width = window.getComputedStyle(barCheck2).width.replace(/[A-Za-z]/ig,"")*1
        let bar2Width = window.getComputedStyle(bar2).width.replace(/[A-Za-z]/ig,"")*1
        window.onmousemove = function(e){
            if(barCheck2Width+e.clientX-ev.clientX+14 < bar2Width){
                barCheck2.style.width = barCheck2Width+e.clientX-ev.clientX+"px"
            }else{
                barCheck2.style.width = bar2Width-14+"px"
            }
            progress = (barCheck2.style.width.replace(/[A-Za-z]/ig,"")*1/(bar2Width-14)).toFixed(2)*1
        }
        window.onmouseup = function () {
            window.onmousemove = function () {
                return false
            }
            audio.currentTime = audio.duration*progress
        }
    }
}
//播放或暂停
let playInterval = null
let nowIndex = 0
let nowMusic = null
function play(index) {
    index = parseInt(index)
    let music = playList[index]
    let path = null
    if(music){
        nowMusic = music
        nowIndex = index
        //每次更换歌曲改变播放列表
        loadPlayList()
        path = music.path+music.fileName
        audio.src = `/getMusic?path=${path}`
        document.getElementById("startTime").innerText = "0:00"
        let endTimeInterval = setInterval(function () {
            if(audio.duration){
                document.getElementById("endTime").innerText = Math.floor(audio.duration/60)+":"+Math.floor(audio.duration%60)
                clearInterval(endTimeInterval)
            }
        },10)
        barCheck2.style.width = "0"
        //设置播放的音乐名等信息
        document.getElementById("musicName").innerText = music.name
        document.getElementById("musicArtist").innerText = music.artist+" 一 "+music.album
        document.getElementById("coverImg").src = "getPicByUrl?url="+music.coverPath
        //设置播放进度为0
        progress = 0
        //播放次数加一
        request({
            url: `/addCount?id=${music.id}`,
            type: "get"
        })
        //上一首播放
        document.getElementById("lastMusicBtn").onclick = function (){
            if(loopFlg){
                //循环播放
                if(!playList[index-1]){
                    play(playList.length-1)
                }else{
                    play(index-1)
                }
            }else{
                //不循环播放
                if(playList[index-1]){
                    play(index-1)
                }
            }
        }
        //下一首播放
        audio.onended = function () {
            if(loopFlg){
                //循环播放
                if(!playList[index+1]){
                    play(0)
                }else{
                    play(index+1)
                }
            }else{
                //不循环播放
                if(!playList[index+1]){
                    //播放完了
                    audio.removeAttribute("src")
                    play()
                }else{
                    play(index+1)
                }
            }
        }
    }
    if(!music && !audio.src){
        document.getElementById("playBtn").className = "icon icon-play"
        document.getElementById("musicName").innerText = ""
        document.getElementById("musicArtist").innerText = ""
        document.getElementById("startTime").innerText = "0:00"
        document.getElementById("endTime").innerText = "0:00"
        barCheck2.style.width = "0px"
        clearInterval(playInterval)
        progress = 0
        nowMusic = null
        return
    }
    if(music || audio.paused){
        //开始播放
        audio.play()
        clearInterval(playInterval)
        document.getElementById("playBtn").className = "icon icon-pause"
        //设置播放的时间
        let bar2Width = window.getComputedStyle(bar2).width.replace(/[A-Za-z]/ig,"")*1
        playInterval = setInterval(function () {
            //设置进度条
            let barCheck2Width = window.getComputedStyle(barCheck2).width.replace(/[A-Za-z]/ig,"")*1
            barCheck2.style.width = barCheck2Width + (bar2Width-14)/audio.duration+"px"
            //每秒设置播放进度百分比
            progress = ((barCheck2Width + (bar2Width-14)/audio.duration)/(bar2Width-14)).toFixed(2)*1
            //每秒设置当前播放时间和剩余时间
            let startTime = Math.floor(audio.currentTime/60)+":"+Math.floor(audio.currentTime%60)
            let endTime = Math.floor((audio.duration-audio.currentTime)/60)+":"+Math.floor((audio.duration-audio.currentTime)%60)
            if(startTime.split(":")[1].length<2){
                startTime = startTime.split(":")[0]+":0"+startTime.split(":")[1]
            }
            if(endTime.split(":")[1].length<2){
                endTime = endTime.split(":")[0]+":0"+endTime.split(":")[1]
            }
            document.getElementById("startTime").innerText = startTime
            document.getElementById("endTime").innerText = endTime
        },1000)
    }else{
        //暂停
        audio.pause()
        document.getElementById("playBtn").className = "icon icon-play"
        clearInterval(playInterval)
    }
}
//监听窗口大小变化
window.onresize = function () {
    barCheck.style.width = (window.getComputedStyle(bar).width.replace(/[A-Za-z]/ig,"")*1-14)*volume+"px"
    barCheck2.style.width = (window.getComputedStyle(bar2).width.replace(/[A-Za-z]/ig,"")*1-14)*progress+"px"
}

//点击搜索框改变搜索框边框样式
function searchCheck(check) {
    let search = document.getElementById("search")
    let playListBtn = document.getElementById("playListBtn")
    let downloadBtn = document.getElementById("downloadBtn")
    if(check){
        search.style.border = "3px solid rgb(149,189,232)"
        search.style.height = "26px"
        search.style.margin = "10px 13px 0 66px"
        playListBtn.style.marginTop = "10px"
        downloadBtn.style.marginTop = "10px"
    }else{
        search.style.border = "1px solid #999"
        search.style.height = "22px"
        search.style.margin = "12px 15px 0 68px"
        playListBtn.style.marginTop = "12px"
        downloadBtn.style.marginTop = "12px"
    }
}

//随机,循环播放按钮点击事件
function randomLoopClick(ele) {
    if(window.getComputedStyle(ele).backgroundColor === "rgba(0, 0, 0, 0)"){
        //更改状态为选中
        ele.style.backgroundColor = "rgb(115,115,115)"
        ele.children[0].style.color = "whitesmoke"
        if(ele.id === "randomBtn"){
            //更改播放顺序为随机播放
            randomFlg = true
            //如果正在播放中
            if(playList.length){
                let tempList = playList.splice(nowIndex,1)
                while (playList.length) {
                    let ranIndex = Math.floor(Math.random()*playList.length)
                    tempList.push(playList.splice(ranIndex,1)[0])
                }
                playList = tempList
                audio.onended = function () {
                    play(1)
                }
                loadPlayList()
            }
        }else if(ele.id === "loopBtn"){
            //更改为循环播放
            loopFlg = true
        }
    }else{
        ele.style.backgroundColor = "rgba(0, 0, 0, 0)"
        ele.children[0].style.color = "rgb(115,115,115)"
        if(ele.id === "randomBtn"){
            //更改播放顺序为顺序播放
            randomFlg = false
            //如果正在播放中
            if(playList.length){
                let id = playList[nowIndex].id
                //根据id进行降序排序(冒泡排序)
                for(let i=1;i<playList.length;i++){
                    for(let j=0;j<playList.length-i;j++){
                        if(playList[j].id<playList[j+1].id){
                            let temp = playList[j+1]
                            playList[j+1] = playList[j]
                            playList[j] = temp
                        }
                    }
                }
                for(let i in playList){
                    if(playList[i].id === id){
                        audio.onended = function () {
                            if(playList[parseInt(i)+1]){
                                play(parseInt(i)+1)
                            }else{
                                audio.removeAttribute("src")
                                play()
                            }
                        }
                    }
                }
                loadPlayList()
            }
        }else if(ele.id === "loopBtn"){
            //不循环播放
            loopFlg = false
        }
    }
}

//列表,下载按钮点击改变样式
function btnClick(ele,click) {
    if(click){
        ele.style.backgroundImage = "linear-gradient(to bottom,rgb(190,190,190),rgb(220,220,220))"
    }else{
        ele.style.backgroundImage = "linear-gradient(to bottom,rgb(250,250,250),rgb(220,220,220))"
    }
}

let playerHeight = window.getComputedStyle(document.getElementById("player")).height.replace(/[A-Za-z]/ig,"")*1
document.getElementById("body").style.height = playerHeight - 80 + "px"


//选中的歌曲
let checkMusicList = []
//歌曲列表
let table = document.getElementById("table")
let nowSheet = -1
let nowSearchName = ""
function getListBySheet(sheet,searchName) {
    checkMusicList = []
    nowSearchName = searchName
    nowSheet = sheet
    let url =  `/getList`
    let data = {}
    data.search = data.search || {}
    data.search.sheet = nowSheet
    if(searchName){
        data.like = data.like || {}
        data.like.searchName = nowSearchName
        data.like.searchWay = searchWay
    }
    request({
        url: url,
        type: "post",
        data: data,
        contentType: "application/json",
        dataType: "json"
    }).then(result => {
        let res = result.data
        document.getElementById("ArtistOrAlubmTable").style.display = "none"
        document.getElementById("table").style.display = ''
        if(document.getElementById("checkAllBox").checked){
            document.getElementById("checkAllBox").click()
        }
        //清空原来的列表
        for(let ele of $("table .listTr")){
            ele.remove()
        }
        for(let i in res){
            let tr = null
            if(i%2){
                tr = $(`<tr class="listTr"></tr>`)
            }else{
                tr = $(`<tr class="listTr backColor"></tr>`)
            }
            //双击播放
            tr.dblclick(function () {
                for(let item of tr.siblings("tr")){
                    item.classList.remove("checkMusic")
                }
                tr.addClass("checkMusic")
                changePlayList(res.slice(),i)
            })
            let checkBox = $(`<input onclick="event.stopPropagation()" name="checkMusic" type="checkbox" value="${res[i].id}" style="margin: 6px 0 0 5px">`)
            checkBox.change(function () {
                checkMusic(this,res[i])
            })
            tr.append($(`<td></td>`).append(checkBox))
            tr.append($(`<td>${res[i].name}</td>`))
            tr.append($(`<td style="padding-right: 5px">${res[i].time}</td>`))
            tr.append($(`<td>${res[i].artist}</td>`))
            tr.append($(`<td>${res[i].album}</td>`))
            //添加到播放列表
            let addPlayListBtn = $(`<i class="icon icon-plus" title="添加到播放列表"></i>`)
            addPlayListBtn.click(function () {
                window.event.stopPropagation()
                addMusicToPlayList([res[i]])
            })
            tr.append($(`<td class="listBtn"></td>`).append(addPlayListBtn))
            //删除音乐
            let deleteBtn = $(`<i class="icon icon-trash" title="删除"></i>`)
            deleteBtn.click(function () {
                window.event.stopPropagation()
                deleteMusics(res[i])
            })
            tr.append($(`<td class="listBtn"></td>`).append(deleteBtn))
            tr.append($(`<td style="text-align: center">${res[i].count}</td>`))
            $("#table").append(tr)
        }
    })
}

//添加音乐到播放列表
function addMusicToPlayList(musics){
    if(!musics.length){
        new $.zui.Messager('请先选择歌曲', {
            type: 'warning' // 定义颜色主题
        }).show();
        return
    }
    playList = playList.concat(musics)
    if(playList.length === musics.length){
        play(0)
    }
    loadPlayList()
    new $.zui.Messager('添加成功', {
        type: 'primary' // 定义颜色主题
    }).show();
}


//添加音乐到歌单
function addMusics() {
    if(!checkMusicList.length){
        new $.zui.Messager('请先选择歌曲', {
            type: 'warning' // 定义颜色主题
        }).show();
        return
    }
    $('#myModal4').modal('show', 'fit')
    for(let item of $(".checkBox2")){
        item.remove()
    }
    let colors = ["label-primary","label-success","label-info","label-warning","label-danger"]
    for(let i=0;i<playLists.length;i++){
        let num = Math.floor(Math.random() * 6);
        let a = $(`<a class="checkBox2"></a>`)
        let checkBox =  $(`<span style="margin: 5px 5px 10px 5px;padding: 10px;border-radius: 15px" class="label label-badge ${colors[num]}">${playLists[i].innerText}</span>`)
        a.append(checkBox)
        $(".moveBox").append(a)
        a.click(function () {
            addMusicToSheet(checkMusicList.slice(),playLists[i].getAttribute("sheetId"))
        })
    }
}
function addMusicToSheet(musics,sheet){
    request({
        url: `/addMusicToSheet?sheet=${sheet}`,
        type: "post",
        data: musics,
        contentType: "application/json"
    }).then(() => {
        new $.zui.Messager('添加成功', {
            type: 'primary' // 定义颜色主题
        }).show();
    })
    $('#myModal4').modal('hide', 'fit')
}


//播放列表
let playList = []
//是否随机播放
let randomFlg = false
//是否循环播放
let loopFlg = false
//改变播放列表
function changePlayList(musics,index){
    playList = []
    if(randomFlg){
        //随机播放
        playList.push(musics.splice(index,1)[0])
        while (musics.length) {
            let ranIndex = Math.floor(Math.random()*musics.length)
            playList.push(musics.splice(ranIndex,1)[0])
        }
        play(0)
    }else{
        //顺序播放
        playList = musics
        play(index)
    }
}


function nextMusic(){
    audio.currentTime = audio.duration
}

$('[data-toggle="popover"]').popover({
    placement: 'bottom',
    html: true
});
//打开播放列表时加载数据
$('[data-toggle="popover"]').on('shown.zui.popover',loadPlayList)
//加载播放列表
function loadPlayList(){
    let content = $(".header3 .popover-content")
    for (let ele of content.children()) {
        ele.remove()
    }
    //遍历播放列表
    for(let i=nowIndex+1;i<playList.length;i++) {
        let div = $(`<div class="playListDiv"></div>`)
        div.append($(`<img src="getPicByUrl?url=${playList[i].coverPath}" style="float: left;width: 43px;height: 43px;margin: 1px 15px 1px 15px">`))
        let div2 = $(`<div class="playListDiv2" style="border-top: ${i === 0 ? '1px solid #ddd' : ''}"></div>`)
        let div3 = $(`<div class="playListDiv3"></div>`)
        div3.append($(`<div class="oneColText">${playList[i].name}</div>`))
        div3.append($(`<div class="oneColText">${playList[i].artist + " 一 " + playList[i].album}</div>`))
        div2.append(div3)
        div2.append($(`<div class="timeDiv">${playList[i].time}</div>`))
        div.append(div2)
        //鼠标悬停时出现的删除按钮，删除播放列表中的歌曲
        let deleteListMusicBtn = $(`<div class="deleteListMusicBtn">-</div>`)
        div.append(deleteListMusicBtn)
        deleteListMusicBtn.click(function (e) {
            e.stopPropagation()
            playList.splice(i, 1)
            loadPlayList()
        })
        div.click(function () {
            for (let i = 0; i < content.children().length; i++) {
                let ele = content.children()[i]
                if(ele.className === "playListDiv"){
                    ele.style.backgroundColor = ""
                    ele.style.color = "black"
                    ele.children[1].style.borderBottom = "1px solid #ddd"
                    if (!i) {
                        ele.children[1].style.borderTop = "1px solid #ddd"
                    }
                }
            }
            div.css("background-color", "rgb(38,135,251)")
            div.css("color", "rgb(212,231,254)")
            div2.css("border-bottom", "none")
            div2.css("border-top", "none")
        })
        div.dblclick(function () {
            play(i)
        })
        content.append(div)
    }
    if(playList.length && nowIndex+1 !== playList.length){
        content.append($(`<div id="clearPlayList" onclick="clearPlayList()">清除</div>`))
    }
}
//清除播放列表
function clearPlayList() {
    playList = []
    loadPlayList()
}

//左侧导航栏歌曲展示所有
function getAllMusic(){
    //如果传了searchName则为条件搜索
    leftNavColor(document.getElementById("allMusic").innerText)
    getListBySheet(-1)
}

//搜索音乐
function searchMusic(e){
    if(e.keyCode === 13){
        getListBySheet(nowSheet,document.getElementById("searchName").value)
    }
}

//绑定左侧导航栏的点击事件
let classs = document.getElementById("class").children
let playLists = document.getElementById("playLists").children
function leftNavColor(name) {
    let ele = null
    //恢复样式
    for(let i=0;i<classs.length;i++){
        classs[i].style.backgroundColor = ""
        classs[i].style.color = "black"
        classs[i].firstChild.style.color = "rgb(115, 115, 115)"
        if(classs[i].innerText === name){
            ele = classs[i]
        }
    }
    for(let i=0;i<playLists.length;i++){
        playLists[i].style.backgroundColor = ""
        playLists[i].style.color = "black"
        playLists[i].firstChild.style.color = "rgb(115, 115, 115)"
    }
    //选中状态
    ele.style.backgroundColor = "rgb(38,135,251)"
    ele.firstChild.style.color = "white"
    ele.style.color = "white"
}

//获取歌单列表
function getSheets(){
    //清空原来的列表
    for(let ele of $("#playLists").children()){
        ele.remove()
    }
    request({
        url: "/getSheets",
        type: "get",
        dataType: "json"
    }).then((res) => {
        //绑定点击事件
        let sheets = []
        //加载新的列表
        for(let item of res){
            let div = document.createElement("div")
            div.style = "font-size: 14px;cursor: default;padding: 2px 0 2px 18px"
            div.innerHTML = "<i class=\"icon icon-music\"></i>"+item.sheetName
            document.getElementById("playLists").append(div)
            div.setAttribute("sheetId",item.id)
            sheets.push(div)
            div.onclick = function () {
                //加载列表数据
                getListBySheet(item.id)
                //恢复样式
                for(let i=0;i<sheets.length;i++){
                    sheets[i].style.backgroundColor = ""
                    sheets[i].style.color = "black"
                    sheets[i].firstChild.style.color = "rgb(115, 115, 115)"
                }
                for(let i=0;i<classs.length;i++){
                    classs[i].style.backgroundColor = ""
                    classs[i].style.color = "black"
                    classs[i].firstChild.style.color = "rgb(115, 115, 115)"
                }
                //选中状态
                div.style.backgroundColor = "rgb(38,135,251)"
                div.firstChild.style.color = "white"
                div.style.color = "white"
            }
            //删除歌单
            div.oncontextmenu = function (e) {
                rightClick('playLists',div)
                e.stopPropagation()
            }
        }
    })
}

function showPlayLists(ele){
    if(ele.innerText === "隐藏"){
        ele.innerText = "显示"
        $("#playLists").css("display","none")
    }else {
        ele.innerText = "隐藏"
        $("#playLists").css("display","block")
    }
}

//根据艺人展示歌曲
function getListByArtist(){
    leftNavColor("艺人")
    document.getElementById("table").style.display = 'none'
    document.getElementById("ArtistOrAlubmTable").style.display = ""
    //清空原来的艺人列表
    for(let ele of $("#ArtistList").children()){
        ele.remove()
    }
    //获取艺人列表
    request({
        url: "/getArtistAlbumMusic",
        type: "get",
        dataType: "json"
    }).then(res => {
        //根据首字母进行字典序排序
        let artists = Pinyin.paixu(Object.keys(res.data))
        for(let artist of artists){
            //加载艺人列表
            let colors = ["#ccc","#ea644a","#03b8cf","#f1a325","#145ccd","#38b03f"]
            let colorIndex = Math.floor(Math.random()*colors.length)
            let div = $(`
                    <div style="cursor: default">
                        <div class="artistHead" style="background-color: ${colors[colorIndex]}">${artist.substring(0,1)}</div>
                        <div style="font-size: 14px;height: 50px;line-height: 50px;margin-left: 65px;border-bottom: 1px solid #ddd">${artist}</div>
                    </div>
                `)
            $("#ArtistList").append(div)
            //绑定点击艺人事件，加载专辑和歌曲
            div.click(function () {
                //清空专辑列表
                for(let ele of $("#albumAndMusic").children()){
                    ele.remove()
                }
                $("#albumAndMusic").append(`
                        <div style="margin: 30px 40px 10px 40px">
                            <h1 style="margin-bottom: 0">${artist}</h1>
                            <p style="font-size: 14px">${res.count[artist].albumCount}张专辑，${res.count[artist].musicCount}首歌曲</p>
                        </div>
                    `)
                //遍历专辑
                let albums = Object.keys(res.data[artist])
                $("#albumAndMusic").append(`<div id="albumsOfArtist" style="margin: 0 40px 10px 40px;border-top: 1px solid #ddd;border-bottom: 1px solid #ddd"></div>`)
                for(let album of albums){
                    let colorIndex = Math.floor(Math.random()*colors.length)
                    let div = $(`
                            <div style="margin: 35px 0 60px 0">
                                <div style="margin-bottom: 20px">
                                    <div class="artistHead" style="line-height:55px;height: 55px;width: 55px;background-color:${colors[colorIndex]};float: left">${album.substring(0,1)}</div>
                                    <div style="height: 100%;margin-left: 75px;padding-top: 2px">
                                        <h1 style="margin: 3px 0">${album}</h1>
                                        <p style="font-size: 14px">${res.data[artist][album].length}首歌曲</p>                              
                                    </div>
                                </div>
                            </div>
                        `)
                    //专辑内音乐遍历
                    let musicOfAlbum = $(`<div></div>`)
                    div.append(musicOfAlbum)
                    $("#albumsOfArtist").append(div)
                    let musics = res.data[artist][album]
                    for(let i in musics){
                        let div = $(`<div style="border-radius:3px;cursor:default;font-size:13px"></div>`)
                        if(i == 0){
                            div.append($(`<div title="firstMusic" style="margin-left: 20px;padding-left:10px;border-bottom: 1px solid #ddd;height: 30px;line-height: 30px;border-top: 1px solid #ddd">${musics[i].name}</div>`))
                        }else{
                            div.append($(`<div style="margin-left: 20px;padding-left:10px;border-bottom: 1px solid #ddd;height: 30px;line-height: 30px">${musics[i].name}</div>`))
                        }
                        div.append($(`<div style="transform:translateY(-30px);height: 30px;line-height: 30px;margin-right:10px;float: right">${musics[i].time}</div>`))
                        div.click(function(){
                            if(document.querySelector(".checkMusicOfAlbum")){
                                if(document.querySelector(".checkMusicOfAlbum").children[0].title === "firstMusic"){
                                    document.querySelector(".checkMusicOfAlbum").children[0].style.borderTop = "1px solid #ddd"
                                    document.querySelector(".checkMusicOfAlbum").children[0].style.borderBottom = "1px solid #ddd"
                                }else {
                                    document.querySelector(".checkMusicOfAlbum").children[0].style.borderBottom = "1px solid #ddd"
                                }
                                document.querySelector(".checkMusicOfAlbum").classList.remove("checkMusicOfAlbum")
                            }
                            div.addClass("checkMusicOfAlbum")
                            div.children()[0].style.border = "none"
                        })
                        div.dblclick(function () {
                            changePlayList(musics.slice(),parseInt(i))
                        })
                        musicOfAlbum.append(div)
                    }
                }
            })
        }
        //点击艺人改变样式
        for(let ele of $("#ArtistList").children()){
            ele.onclick = function () {
                for(let item of $("#ArtistList").children()){
                    item.style.backgroundColor = ""
                    item.style.color = "black"
                    item.children[1].style.borderBottom = "1px solid #ddd"
                }
                ele.style.backgroundColor = "rgb(38,135,251)"
                ele.style.color = "white"
                ele.children[1].style.borderBottom = "none"
            }
        }
        $("#ArtistList").children()[0].click()
    })
}

//选择音乐
function checkMusic(ele,music) {
    if(ele.checked){
        //选中
        checkMusicList.push(music)
    }else{
        //取消选中
        let index = checkMusicList.indexOf(music)
        checkMusicList.splice(index,1)
    }
}

//多选音乐
function checkMusics(ele){
    if(ele.checked){
        //全选
        for(let music of document.getElementsByName("checkMusic")){
            if(!music.checked){
                music.click()
            }
        }
    }else{
        //全不选
        for(let music of document.getElementsByName("checkMusic")){
            if(music.checked){
                music.click()
            }
        }
    }
}

function deleteMusics(music){
    let bool = confirm("确定删除？")
    if(!bool){
        return
    }
    let data = null
    if(music){
        //如果删除了播放列表内的歌曲  则删除播放列表内的歌曲
        for(let i in playList){
            if(playList[i] === music){
                //如果删除正在播放的歌曲  则切换下一首
                if(playList.splice(i,1)[0] === nowMusic){
                    play(i)
                }
            }
            loadPlayList()
        }
        data = [music]
    }else{
        if(checkMusicList.length){
            //如果删除了播放列表内的歌曲  则删除播放列表内的歌曲
            for(let checkMusic of checkMusicList){
                for(let i in playList){
                    //如果删除正在播放的歌曲  则切换下一首
                    if(checkMusic === playList[i]){
                        if(playList.splice(i,1)[0] === nowMusic){
                            play(i)
                        }
                    }
                }
            }
            data = checkMusicList
        }else{
            new $.zui.Messager('请先选择歌曲', {
                type: 'warning' // 定义颜色主题
            }).show();
            return
        }
    }
    request({
        url: `/deleteMusics`,
        type: "post",
        data: data,
        contentType: "application/json"
    }).then(() => {
        new $.zui.Messager('删除成功', {
            type: 'primary' // 定义颜色主题
        }).show();
        getListBySheet(nowSheet,nowSearchName)
    })
}

//新建歌单
function addSheet(){
    let name = prompt("请输入歌单名称")
    if(name){
        request({
            url: `addSheet?name=${name}`,
            type: "get"
        }).then(res => {
            new $.zui.Messager(res, {
                type: res === "添加成功" ? 'primary' : 'danger' // 定义颜色主题
            }).show();
            getSheets()
        })
    }else{
        new $.zui.Messager('不可为空', {
            type: 'danger' // 定义颜色主题
        }).show();
    }
}

//右键点击
function rightClick(type,dom){
    let e = window.event
    let rightMenu = document.getElementById("rightMenu")
    rightMenu.style.opacity = "1"
    rightMenu.style.left = e.clientX+"px"
    rightMenu.style.top = e.clientY+"px"
    rightMenu.style.display = ""
    if(type === "table"){
        for(let i=0;i<rightMenu.children.length;i++){
            rightMenu.children[i].style.display = 'none'
        }
        document.getElementById("tableRightMenu").style.display = ""
    }else if(type === "playLists"){
        for(let i=0;i<rightMenu.children.length;i++){
            rightMenu.children[i].style.display = 'none'
        }
        document.getElementById("playListsRightMenu").style.display = ""
        document.getElementById("right-menu-playlist-delete").style.display = "none"
        document.getElementById("right-menu-playlist-rename").style.display = "none"
        //右击歌单,可以对歌单进行编辑
        if(dom){
            document.getElementById("right-menu-playlist-delete").style.display = ""
            document.getElementById("right-menu-playlist-rename").style.display = ""
            for(let ele of document.getElementById("playListsRightMenu").children){
                if(ele.innerText === "删除歌单"){
                    ele.onclick = function () {
                        if(confirm("确定删除？")){
                            request({
                                url: `/deleteSheet?sheet=${dom.getAttribute("sheetId")}`,
                                type: "delete"
                            }).then(() => {
                                new $.zui.Messager('删除成功', {
                                    type: 'primary' // 定义颜色主题
                                }).show();
                                getSheets()
                            })
                        }
                    }
                }else if(ele.innerText === "重命名"){
                    ele.onclick = function () {
                        let newName = prompt("输入新的歌单名称","")
                        if(!newName){
                            return
                        }
                        if(newName === dom.innerText){
                            new $.zui.Messager('名称重复', {
                                type: 'warning' // 定义颜色主题
                            }).show();
                            return
                        }
                        request({
                            url: `/updateSheet?oldId=${dom.getAttribute("sheetId")}&newName=${newName}`,
                            type: "get"
                        }).then(res => {
                            if(res.includes("成功")){
                                getSheets()
                            }
                            new $.zui.Messager(res, {
                                type: res.includes("成功") ? "success" : "warning" // 定义颜色主题
                            }).show();
                        })
                    }
                }
            }
        }
    }
    //屏蔽浏览器自带右键菜单
    e.returnValue = false;
    return false;
}

//关闭右键菜单
function closeRightMenu(){
    document.getElementById("rightMenu").style.opacity = "0"
    setTimeout(function () {
        document.getElementById("rightMenu").style.display = "none"
    },100)
}

window.onmousedown = function(){
    if(!window.event.button){
        closeRightMenu()
    }
}

//下载选中的音乐
function downLoadMusics(){
    if(!checkMusicList.length){
        new $.zui.Messager('请先选择歌曲', {
            type: 'warning' // 定义颜色主题
        }).show();
    }
    for(let music of checkMusicList){
        let link = document.getElementById("downloadLink")
        link.href = `/getMusic?path=${music.path+music.fileName}`
        let fileType = music.fileName.split(".")[music.fileName.split(".").length-1]
        link.download = music.artist+" - " + music.name + "." + fileType
        link.click()
    }
}

//选择搜索方式
let searchWay = ""
function checkSearchWay(ele){
    document.getElementById('searchByBox').style.display = 'none'
    let ways = document.querySelectorAll("#searchByBox>div")
    searchWay = ele.title
    for(let way of ways){
        way.children[0].style.display = "none"
    }
    ele.children[0].style.display = "block"
}

getSheets()
getAllMusic()
