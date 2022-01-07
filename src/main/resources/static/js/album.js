

//关闭弹窗时清空数据
$('#myModal2').on('hide.zui.modal', function () {
    $("#newTypeNm")[0].value = ''
})


//右键菜单
//右键点击
/**
 *
 * @param menuId 要展开的右键菜单
 * @param dom 传过来的参数
 * @returns {boolean} return false取消浏览器自带的右键菜单
 */
function openRightMenu(menuId,dom){
    let e = window.event
    let rightMenu = document.getElementById("rightMenu")
    rightMenu.style.opacity = "1"
    rightMenu.style.left = e.clientX+"px"
    rightMenu.style.top = e.clientY+"px"
    rightMenu.style.display = ""
    if(menuId === "albumsRightMenu"){
        for(let i=0;i<rightMenu.children.length;i++){
            rightMenu.children[i].style.display = 'none'
        }
        document.getElementById("albumsRightMenu").style.display = ""
        document.getElementById("right-menu-album-delete").style.display = "none"
        document.getElementById("right-menu-album-rename").style.display = "none"
        if(dom){
            //右击相册
            document.getElementById("right-menu-album-delete").style.display = ""
            document.getElementById("right-menu-album-rename").style.display = ""
            //删除相册
            document.getElementById("right-menu-album-delete").onclick = function(){
                if(confirm("确定删除？")){
                    deleteType([dom])
                }
            }
            //重命名
            document.getElementById("right-menu-album-rename").onclick = function(){
                let newName = prompt("输入新的相册名","")
                if(newName){
                    updateAlbum(dom,newName)
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


//修改相册名
function updateAlbum(id,newName){
    request({
        url: "/album/updateAlbum",
        type: "post",
        data :{
            id: id,
            name: newName
        }
    }).then(res => {
       if(res.includes("成功")){
           new $.zui.Messager(res, {
               type: 'success' // 定义颜色主题
           }).show();
           getPhotos(nowPage,nowSize,newName)
       }else{
           new $.zui.Messager(res, {
               type: 'warning' // 定义颜色主题
           }).show();
       }
    })
}

//查询照片方法
let nowPage = 1
let nowSize = 10
let nowType = null
let types = []
function getPhotos(page,size,type){
    nowPage = page || nowPage
    nowSize = size || nowSize
    nowType = type || null
    uploader.options.multipart_params.type = nowType
    if(!nowType){
        document.getElementById("uploaderExample").style.display = 'none'
    }else{
        document.getElementById("uploaderExample").style.display = ''
    }
    request({
        url: `/getPhotos?page=${nowPage}&size=${nowSize}${nowType ? '&type='+nowType : ''}`,
        type: "get",
        dataType: "json",
        contentType: "application/json"
    }).then((data) => {
        request({
            url: "/getTypesOfUser",
            type: "get"
        }).then(res => {
            types = [{
                id: null,
                name: '全部'
            }].concat(res)
            //相册导航栏刷新
            for(let item of $("#albumList ul li")){
                item.remove()
            }
            let ul = $("#albumList ul.nav")
            for(let i in types){
                let li = $(`<li class="${types[i].id===nowType?'active':''}"><a>${types[i].name}</a></li>`)
                //右击相册
                li.on('contextmenu',function (e) {
                    openRightMenu('albumsRightMenu',types[i].id)
                    e.stopPropagation()
                })
                li.click(function () {
                    getPhotos(1,nowSize,types[i].id)
                })
                ul.append(li)
            }
        })
        //图片更新
        for(let item of $("div.photoBox")){
            item.remove()
        }
        let W = document.documentElement.clientWidth;
        let lazyLoadImgs = []
        for(let i in data.photos){
            let div = document.createElement("div")
            div.className = "load-indicator loading photoBox"
            let card = document.createElement("a")
            card.className = "card"
            let img = document.createElement("img")
            img.setAttribute("data-src",`getPicByUrl?url=${data.photos[i].path+data.photos[i].fileName}&comp=true`)
            img.className = "checkPhotos"
            img.name = data.photos[i].path+data.photos[i].fileName
            card.appendChild(img)
            card.appendChild(document.createElement("div"))
            div.appendChild(card)
            document.querySelector("#photos-panel .panel-body").append(div)
            $(card).lightbox({
                image: `getPicByUrl?url=${data.photos[i].path+data.photos[i].fileName}`
            })
            img.onload = function(){
                div.classList.remove("loading")
            }
            lazyLoadImgs.push(img)
        }
        let window = document.getElementById("photos-panel")
        lazyLoad(window,lazyLoadImgs)
        $('#myPager').data('zui.pager').set(nowPage, data.count,nowSize);
        cancelCheck()
    })
}

function uploadFile(){
    if(!nowType){
        new $.zui.Messager('请选择相册', {
            type: 'warning' // 定义颜色主题
        }).show();
        window.event.stopPropagation()
    }
}

//上传照片初始化
$('#uploaderExample').uploader({
    autoUpload: false,            // 当选择文件后立即自动进行上传操作
    url: '/savePhoto',  // 文件上传提交地址
    filters:{
        mime_types: [
            {title: '图片', extensions: 'bmp,png,tif,JPEG,jpg'}
        ]
    },
    headers: {
        token: localStorage.getItem("token")
    },
    fileList: '#myFileList',
    multipart_params:{
        type: 0
    },
    //当文件被添加到上传队列时触发
    onFilesAdded:function (files) {
        if(!nowType){
            new $.zui.Messager('请选择相册', {
                type: 'warning' // 定义颜色主题
            }).show();
            for(let file of files){
                uploader.removeFile(file)
            }
            return
        }
        //开始上传
        uploader.start()
        document.getElementById("myFileList").style.display = "block"
    },
    onUploadProgress:function () {
        //进度变化
    },
    onUploadComplete:function () {
        //上传完成
        new $.zui.Messager('上传完成', {
            type: 'success' // 定义颜色主题
        }).show();
        document.getElementById("myFileList").style.display = "none"
        //上传完成清空任务队列
        let fileList = []
        Object.assign(fileList,$('#uploaderExample').data('zui.uploader').getFiles())
        if(fileList.length){
            for(let item of fileList){
                $('#uploaderExample').data('zui.uploader').removeFile(item)
            }
        }
        getPhotos(nowPage,nowSize,nowType)

    },
    onError:function (error) {
        //上传发生错误
        new $.zui.Messager("文件："+error.file.name+" "+(error.message==='File extension error.'?'文件类型错误':error.message), {
            type: 'danger' // 定义颜色主题
        }).show();
    }
});
let uploader = $('#uploaderExample').data('zui.uploader');


//分页器初始化
$('#myPager').pager({
    onPageChange: function(state, oldState) {
        let types = document.querySelectorAll(".nav-simple li")
        let type = ''
        types.forEach(item => {
            if(item.className=='active'){
                type = item.title
            }
        })
        if (state.page !== oldState.page) {
            getPhotos(state.page,state.recPerPage,type)
        }
    },
    menuDirection: 'dropup',
    lang:'zh_cn'
});

function goPage() {
    let myPager = $('#myPager').data('zui.pager');
    getPhotos(parseInt($(".pageNum")[0].value),myPager.state.recPerPage)
}

//新建相册
function changeType(){
    let newTypeNm = $("#newTypeNm")[0].value
    if(!newTypeNm){
        new $.zui.Messager(`请输入相册名`, {
            type: "warning" // 定义颜色主题
        }).show();
        return
    }
    request({
        url: `/createType?newTypeNm=${newTypeNm}`,
        type: "get",
        dataType: "text",
        contentType: "application/json"
    }).then((data) => {
        if(data.indexOf("成功") == -1){
            new $.zui.Messager(data, {
                type: "warning" // 定义颜色主题
            }).show();
        }else{
            new $.zui.Messager(data, {
                type: "success" // 定义颜色主题
            }).show();
            $('#myModal2').modal('hide', 'fit')
            getPhotos(nowPage,nowSize,nowType)
        }
    })
}

//删除相册
function deleteType(deleteTypes) {
    let data = deleteTypes
    request({
        url: `/deleteTypes`,
        type: "post",
        data: data,
        dataType: "text",
        contentType: "application/json"
    }).then((data) => {
        new $.zui.Messager(data, {
            type: "success" // 定义颜色主题
        }).show();
        getPhotos()
    })
}

//多选图片
var checkPhotos = []
function checkPhoto() {
    document.querySelector(".deleteBtn").style.display = "none"
    document.querySelector(".deleteBtn2").style.display = ""
    document.querySelector(".moveBtn").style.display = ""
    document.querySelector(".cancelCheck").style.display = ""
    checkPhotos = []
    document.querySelectorAll(".checkPhotos").forEach(item => {
        item.onclick = function (e) {
            e.stopPropagation()
            item.nextSibling.className = item.nextSibling.className ? "" : "checkIcon"
            if(item.nextSibling.className){
                checkPhotos.push(item.name)
            }else{
                for(let i in checkPhotos){
                    if(checkPhotos[i] === item.name){
                        checkPhotos.splice(i,1)
                    }
                }
            }
        }
        item.nextSibling.onclick = item.onclick
    })
}

//删除图片
function deletePhotos() {
    let bool = null
    if(checkPhotos.length){
        bool = confirm("确定要删除吗？")
    }else{
        bool = confirm("将删除本页全部照片，是否继续？")
    }
    if(bool){
        if(!checkPhotos.length){
            document.querySelectorAll(".checkPhotos").forEach(item => {
                checkPhotos.push(item.name)
            })
            //如果没有照片可以删除
            if(!checkPhotos.length){
                new $.zui.Messager("没有照片", {
                    type: "warning" // 定义颜色主题
                }).show();
                return
            }
        }
        request({
            url: `/deletePhotos`,
            type: "post",
            data: checkPhotos,
            dataType: "text",
            contentType: "application/json"
        }).then((data) => {
            checkPhotos = []
            new $.zui.Messager(data, {
                type: "success" // 定义颜色主题
            }).show();
            getPhotos(nowPage,nowSize,nowType)
        })
    }
}


//移动照片
function movePhotos() {
    for(let item of $(".checkBox2")){
        item.remove()
    }
    let colors = ["label-primary","label-success","label-info","label-warning","label-danger"]
    for(let i in types){
        if(!types[i].id){
            continue
        }
        let num = Math.floor(Math.random() * 6);
        let a = $(`<a class="checkBox2"></a>`)
        let checkBox =  $(`<span style="margin: 5px 5px 10px 5px;padding: 10px;border-radius: 15px" class="label label-badge ${colors[num]}">${types[i].name}</span>`)
        a.append(checkBox)
        $(".moveBox").append(a)
        a.click(function () {
            if(!checkPhotos.length){
                //如果没有照片可以移动
                new $.zui.Messager("没有照片", {
                    type: "warning" // 定义颜色主题
                }).show();
                $('#myModal4').modal('hide', 'fit')
                return
            }
            for(let i in checkPhotos){
                checkPhotos[i] = checkPhotos[i].split("/")[checkPhotos[i].split("/").length-1]
            }
            request({
                url: `/movePhotos?type=${types[i].id}`,
                type: "post",
                data: checkPhotos,
                dataType: "text",
                contentType: "application/json"
            }).then((data) => {
                checkPhotos = []
                new $.zui.Messager(data, {
                    type: "success" // 定义颜色主题
                }).show();
                $('#myModal4').modal('hide', 'fit')
                getPhotos(nowPage,nowSize,nowType)
            })
        })
    }
}

//取消多选
function cancelCheck() {
    checkPhotos = []
    document.querySelector(".deleteBtn").style.display = ""
    document.querySelector(".deleteBtn2").style.display = "none"
    document.querySelector(".moveBtn").style.display = "none"
    document.querySelector(".cancelCheck").style.display = "none"
    document.querySelectorAll(".checkPhotos").forEach(item => {
        item.onclick = ""
        item.nextSibling.className = ""
    })
}

getPhotos()