
//将uri传过来的msg弹窗显示
function showMsg(){
    let params = window.location.search.substring(1).split("&")
    let msg = ""
    for (let param of params){
        if(param.split("=")[0] === "msg"){
            msg = param.split("=")[1]
        }
    }
    if(msg){
        new $.zui.Messager(decodeURI(msg), {
            type: 'warning' // 定义颜色主题
        }).show();
    }
}
showMsg()


//获取用户信息并展示
function showUser() {
    if(localStorage.getItem("token")){
        request({
            url: "/userInfo"
        }).then(res => {
            document.getElementById("userId").innerText = "ID：" + res.userId
            document.getElementById("userName").innerText = res.userName || res.userId
            if(res.headImg && res.headImg !== "null"){
                document.getElementById("headImg").src = "getPicByUrl?url="+res.headImg
            }
            document.getElementById("photoCount").innerText = res.photoCount || "0"
            document.getElementById("musicCount").innerText = res.musicCount || "0"
        })
    }else{
        document.getElementById("showMore").innerHTML = "登录体验更多功能"
        document.getElementById("userId").innerText = ""
        document.getElementById("userName").innerText = "登录"
        document.getElementById("userName").style.cursor = "pointer"
        document.getElementById("userName").onclick = function(){
            location.href = "/loginPage.html?url=/home.html"
        }
        document.getElementById("edit").style.display = "none"
        document.getElementById("headImg").removeAttribute("src")
        document.getElementById("photoCount").innerText = "0"
        document.getElementById("musicCount").innerText = "0"
    }
}
showUser()

//编辑用户信息
function editUser() {
    //按钮样式改变
    document.getElementById("edit").style.display = "none"
    document.getElementById("editOver").style.display = ""
    //用户名可输入
    let userName = document.getElementById("userName")
    let userNameInput = document.getElementById("userNameInput")
    userName.style.display = "none"
    userNameInput.style.display = "block"
    userNameInput.value = userName.innerText
    //点击更换头像
    document.getElementById("uploadImg").className = "uploadImg"
    document.getElementById("uploadImg").onclick = function () {
        document.getElementById("upload").click()
    }
}

//上传头像
function uploadHead() {
    let files = document.getElementById("upload").files
    let data = new FormData()
    data.append("file",files[0])
    request({
        url: "/updateUserHead",
        type: "post",
        data: data,
        contentType:false,
        processData: false
    }).then(res => {
        document.getElementById("headImg").src = "getPicByUrl?url="+res
        new $.zui.Messager("上传成功", {
            type: 'success' // 定义颜色主题
        }).show();
    })
}

//完成编辑
function editOver() {
    //按钮样式改变
    document.getElementById("edit").style.display = ""
    document.getElementById("editOver").style.display = "none"
    //用户名不可输入
    let userName = document.getElementById("userName")
    let userNameInput = document.getElementById("userNameInput")
    userName.style.display = ""
    userNameInput.style.display = "none"
    document.getElementById("uploadImg").className = ""
    document.getElementById("uploadImg").onclick = null
    if(userNameInput.value === userName.innerText){
        return
    }
    request({
        url: "/updateUser",
        type: "post",
        data: {userName: userNameInput.value}
    }).then(res => {
        new $.zui.Messager("编辑成功", {
            type: 'success' // 定义颜色主题
        }).show();
        userName.innerText = res.userName
    })
}
