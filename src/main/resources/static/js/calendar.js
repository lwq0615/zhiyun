// 手动通过点击模拟高亮菜单项
//左侧导航配置
$('#treeMenu').on('click', 'a', function() {
    $('#treeMenu li.active').removeClass('active');
    $(this).closest('li').addClass('active');
});

//判断用户是否有权限访问该工具
function toolPower(name){
    return new Promise((resolve, reject) => {
        request({
            url: `/tools/queryToolPower?tool=${name}`,
            type: "get"
        }).then(res => {
            resolve(res)
        })
    })
}

//隐藏其他工具box，只展示点击的工具box
function showBox(name) {
    let boxs = document.getElementById("toolBox").children
    for(let i=0;i<boxs.length;i++){
        let ele = boxs[i]
        if(ele.id !== name){
            ele.style.display = "none"
        }else{
            ele.style.display = "block"
        }
    }
}

//日历新增事件弹出框
$('#add_event_box').modal({
    keyboard: true,
    moveable: true,
    position: "fit",
    rememberPos: true,
    show: false
})
//关闭弹窗时清除图片容器的数据防止误上传
$('#add_event_box').on('hide.zui.modal', function() {
    imgContainer.removeImgs(imgContainer.fileList.netFile.slice())
    imgContainer.removeImgs(imgContainer.fileList.localFile.slice())
})



//将add-event-input-imgList配置为照片列表节点
let imgContainer = document.getElementById("add-event-input-imgList")
imgContainer.fileList = {
    //本地的图片
    localFile: [],
    //后台获取的图片
    netFile: []
}
//将文件添加到容器
imgContainer.addImgs = function (imgs) {
    if(!Array.isArray(imgs)){
        imgs = [imgs]
    }
    for(let item of imgs){
        if(typeof item === "string"){
            this.fileList.netFile.push(item)
        }else{
            this.fileList.localFile.push(item)
        }
    }
    this.updateImgs()
}
//从容器中删除文件
imgContainer.removeImgs = function (imgs) {
    if(!Array.isArray(imgs)){
        imgs = [imgs]
    }
    let imgs2 = []
    for(let item of imgs){
        if(this.fileList.netFile.includes(item)){
            this.fileList.netFile.splice(this.fileList.netFile.indexOf(item),1)
        }else{
            imgs2.push(item)
        }
    }
    for(let item of imgs2){
        if(this.fileList.localFile.includes(item)){
            this.fileList.localFile.splice(this.fileList.localFile.indexOf(item),1)
        }
    }
    this.updateImgs()
}
//更新容器照片状态
imgContainer.updateImgs = function() {
    this.innerHTML = ""
    //展示网络图片
    for(let item of this.fileList.netFile){
        let div = document.createElement("div")
        div.className = "imgItem"
        $(div).lightbox({
            image: `getPicByUrl?url=${item}`
        });
        div.innerHTML = `<img class="imgItem" src="/getPicByUrl?comp=true&url=${item}">`
        let close = document.createElement("div")
        close.className = "delImg"
        div.appendChild(close)
        close.onclick = function(e){
            e.stopPropagation()
            imgContainer.removeImgs(item)

        }
        this.appendChild(div)
    }
    //展示本地未上传到服务器的图片
    for(let item of this.fileList.localFile){
        let div = document.createElement("div")
        div.className = "imgItem"
        div.onclick = function(){
            window.open(item.tempPath)
        }
        div.innerHTML = `<img class="imgItem" src="${item.tempPath}">`
        let close = document.createElement("div")
        close.className = "delImg"
        div.appendChild(close)
        close.onclick = function(e){
            e.stopPropagation()
            imgContainer.removeImgs(item)

        }
        this.appendChild(div)
    }
}

//上传图片
function uploadImgs(ele) {
    let localImgs = []
    for(let i=0;i<ele.files.length;i++){
        let file = ele.files[i]
        localImgs.push({
            tempPath: window.URL.createObjectURL(file),
            file: file
        })
    }
    imgContainer.addImgs(localImgs)
    ele.value = ""
}




//将add-event-input-fileList配置为文件列表节点
let fileContainer = document.getElementById("add-event-input-fileList")
fileContainer.fileList = {
    //本地的图片
    localFile: [],
    //后台获取的图片
    netFile: []
}
//将文件添加到容器
fileContainer.addFiles = function (files) {
    if(!Array.isArray(files)){
        files = [files]
    }
    for(let item of files){
        if(typeof item === "string" || typeof item === "number"){
            this.fileList.netFile.push(item)
        }else{
            this.fileList.localFile.push(item)
        }
    }
    this.updateFiles()
}
//从容器中删除文件
fileContainer.removeFiles = function (files) {
    if(!Array.isArray(files)){
        files = [files]
    }
    let files2 = []
    for(let item of files){
        if(this.fileList.netFile.includes(item)){
            this.fileList.netFile.splice(this.fileList.netFile.indexOf(item),1)
        }else{
            files2.push(item)
        }
    }
    for(let item of files2){
        if(this.fileList.localFile.includes(item)){
            this.fileList.localFile.splice(this.fileList.localFile.indexOf(item),1)
        }
    }
    this.updateFiles()
}
//更新容器照片状态
fileContainer.updateFiles = function() {
    this.innerHTML = ""
    //展示网络文件
    if(this.fileList.netFile.length){
        request({
            url: "/tools/getFiles",
            type: "post",
            data: this.fileList.netFile
        }).then(res => {
            //获取网络文件的文件名等信息
            for(let item of this.fileList.netFile){
                for(let i in res){
                    let file = res[i]
                    if(file.id == item){
                        let size = ""
                        if(file.size < 1024*1024){
                            //文件大小小于1MB，用KB显示
                            size = (file.size/1024).toFixed(2)+"KB"
                        }else if(file.size >= 1024*1024){
                            size = (file.size/1024/1024).toFixed(2)+"MB"
                        }
                        let div = document.createElement("div")
                        div.innerHTML = `
                            <a href="/getFileByUrl?path=${file.path}" download="${file.name}">
                                <span>${file.name}</span>
                                <span style="padding-left: 10px">${size}</span>
                            </a>
                        `
                        this.appendChild(div)
                        res.splice(i,1)
                        break
                    }
                }
            }
        })
    }
    //展示本地未上传到服务器的文件
    for(let item of this.fileList.localFile){
        let size = ""
        if(item.size < 1024*1024){
            //文件大小小于1MB，用KB显示
            size = (item.size/1024).toFixed(2)+"KB"
        }else if(item.size >= 1024*1024){
            size = (item.size/1024/1024).toFixed(2)+"MB"
        }
        let div = document.createElement("div")
        div.innerHTML = `
            <a href="/getFileByUrl?path=${item.tempPath}" download="${item.name}">
                <span>${item.name}</span>
                <span style="padding-left: 10px">${size}</span>
            </a>
        `
        this.appendChild(div)
    }
}


//上传图片
function uploadFiles(ele) {
    let localFiles = []
    for(let i=0;i<ele.files.length;i++){
        let file = ele.files[i]
        if(file.size > 1024*1024*1024){
            new $.zui.Messager(file.name+'文件过大', {
                type: 'warning' // 定义颜色主题
            }).show();
            continue
        }
        localFiles.push({
            tempPath: window.URL.createObjectURL(file),
            file: file,
            name: file.name,
            size: file.size
        })
    }
    fileContainer.addFiles(localFiles)
    ele.value = ""
}







//动态加载日历新增事件弹出框
function loadAddBox(event) {
    /* 将图片信息添加到容器中
     先清空原数据*/
    imgContainer.removeImgs(imgContainer.fileList.netFile.slice())
    imgContainer.removeImgs(imgContainer.fileList.localFile.slice())
    fileContainer.removeFiles(fileContainer.fileList.netFile.slice())
    fileContainer.removeFiles(fileContainer.fileList.localFile.slice())
    //传入event，为编辑,否则为新增
    if(event){
        //展示删除按钮
        document.getElementById("add-event-input-delete").style.display = "block"
        //输入框赋值
        document.getElementById("add_event_box_date").innerText = event.start.format("yyyy-MM-dd")
        document.querySelector("#add_event_box .add-event-input-title").value = event.title
        document.querySelector("#add_event_box .add-event-input-textarea").innerText = event.desc
        if(event.allDay){
            //不填入时间
            document.getElementById("add-event-input-time").value = ""
        }else{
            //填入时间
            document.getElementById("add-event-input-time").value = event.start.format("hh:mm")
        }
        document.getElementById("add-event-input-delete").onclick = function (){
            deleteEvent(event.data.id)
        }
        //将后台获取的图片地址存入容器
        event.data.imgs ? imgContainer.addImgs(event.data.imgs.split(",")) : null
        event.data.files ? fileContainer.addFiles(event.data.files.split(",")) : null
        //提交的方法
        document.getElementById("add-event-input-submit").onclick = function (){
            saveEvent(event.data.id)
        }
    }else{
        //隐藏删除按钮
        document.getElementById("add-event-input-delete").style.display = "none"
        document.querySelector("#add_event_box .add-event-input-title").value = ""
        document.querySelector("#add_event_box .add-event-input-textarea").innerText = ""
        document.getElementById("add-event-input-time").value = ""
        //提交的方法
        document.getElementById("add-event-input-submit").onclick = function (){
            saveEvent()
        }
    }
    $('#add_event_box').modal('show', 'fit')
}


//点击保存按钮触发事件
async function saveEvent(id) {
    let date = document.getElementById("add_event_box_date").innerText
    let title = document.querySelector("#add_event_box .add-event-input-title").value
    let detail = document.querySelector("#add_event_box .add-event-input-textarea").innerText
    let time = document.getElementById("add-event-input-time").value
    if(!title){
        new $.zui.Messager('请填写标题', {
            type: 'warning' // 定义颜色主题
        }).show();
        return
    }
    document.querySelector("#add_event_box .modal-dialog").classList.add("loading")
    let data = {
        date,
        title,
        detail,
        time,
        imgs: imgContainer.fileList.netFile || [],
        files: fileContainer.fileList.netFile || []
    }
    id ? data.id = id : null
    //如果有本地图片先上传图片到服务器换取存储地址
    if(imgContainer.fileList.localFile.length){
        await uploadLocalImgs(imgContainer.fileList.localFile.slice()).then(res => {
            data.imgs = data.imgs.concat(res).join(",")
        })
    }else{
        data.imgs = data.imgs.join(",")
    }
    //如果有本地文件先上传图片到服务器换取存储地址
    if(fileContainer.fileList.localFile.length){
        await uploadLocalFiles(fileContainer.fileList.localFile.slice()).then(res => {
            for(let item of res){
                data.files.push(item.id)
            }
            data.files = data.files.join(",")
        })
    }else{
        data.files = data.files.join(",")
    }
    submitEvent(data)
}


//日历
function calendar() {
    toolPower("rl").then(res => {
        if (!res) {
            new $.zui.Messager('没有权限使用该工具', {
                type: 'warning' // 定义颜色主题
            }).show();
            return
        }
        showBox("rlBox")
        //初始化日历
        $('#calendar').calendar({
            lang: "zh_cn",
            //点击事件触发
            clickEvent: function (event) {
                //将事件信息填入dialog
                loadAddBox({...event.event})
            },
            //点击日期单元格触发
            clickCell: function (event) {
                //添加事件
                document.getElementById("add_event_box_date").innerText = event.date.format("yyyy-MM-dd")
                loadAddBox()
            },
            //拖动事件更改日期
            beforeChange(e){
                let event = e.event
                event[e.change] = e.to
                let data = {
                    id: event.data.id,
                    date: event.start.format("yyyy-MM-dd"),
                    title: event.title,
                    detail: event.desc,
                    imgs: event.data.imgs,
                    files: event.data.files
                }
                event.allDay ? null : data.time = event.start.format("hh:mm")
                submitEvent(data)
            }
        })
        riliUpdate()
    })
}


//更新日历数据
function riliUpdate() {
    //加载日历上的事件数据
    request({
        url: "/tools/rili/getEvents",
        type: "get"
    }).then(res => {
        let newEvent = [];
        for(let item of res){
            newEvent.push({
                title: item.title,
                desc: item.detail,
                start: item.date + " " + (item.time || ""),
                end: item.date + " " + (item.time || ""),
                allDay: !item.time,
                data: {
                    imgs: item.imgs,
                    files: item.files,
                    id: item.id
                }
            })
        }
        let calendar = $('#calendar').data('zui.calendar')
        //先删除旧的数据
        let oldIds = []
        for(let item of calendar.events){
            oldIds.push(item.id)
        }
        calendar.removeEvents(oldIds)
        //更新新的数据
        calendar.addEvents(newEvent)
    })
}

/*
//将本地照片上传服务器，换取图片在服务器的存储地址
localImgs:{
    file: 文件
}
*/
function uploadLocalImgs(localImgs){
    return new Promise((resolve, reject) => {
        let imgData = new FormData()
        if(localImgs.length){
            localImgs.forEach(item => {
                imgData.append("files",item.file)
            })
            request({
                url: "/tools/rili/uploadEventImgs",
                type: "post",
                data: imgData,
                contentType: false,
                processData: false
            }).then(res => {
                resolve(res)
            })
        }
    })
}


/*
//将本地文件上传服务器，换取文件在服务器的存储地址
localFiles:{
    file: 文件
}
*/
function uploadLocalFiles(localFiles){
    return new Promise((resolve, reject) => {
        let fileData = new FormData()
        if(localFiles.length){
            localFiles.forEach(item => {
                fileData.append("files",item.file)
            })
            request({
                url: "/tools/rili/uploadEventFiles",
                type: "post",
                data: fileData,
                contentType: false,
                processData: false
            }).then(res => {
                resolve(res)
            })
        }
    })
}

/*提交日历事件
data:事件参数*/
async function submitEvent(data) {
    request({
        url: "/tools/rili/saveEvent",
        type: "post",
        data: data
    }).then(res => {
        if(res === 1){
            document.querySelector("#add_event_box .modal-dialog").classList.remove("loading")
            new $.zui.Messager('保存成功', {
                type: 'success' // 定义颜色主题
            }).show();
            $('#add_event_box').modal('hide')
            riliUpdate()
        }
    })
}

//删除日历事件
function deleteEvent(id) {
    if(confirm("确定要删除吗？")){
        request({
            url: "/tools/rili/deleteEvent?id="+id,
            type: "get"
        }).then(res => {
            if(res === 1){
                new $.zui.Messager('删除成功', {
                    type: 'success' // 定义颜色主题
                }).show();
                $('#add_event_box').modal('hide')
                riliUpdate()
            }
        })
    }
}