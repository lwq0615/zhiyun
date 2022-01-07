function login(e) {
    //回车登录
    if (e && e.keyCode !== 13) {
        return
    }
    let user = {
        userId: $("#username")[0].value,
        password: $("#password")[0].value
    }
    if (!user.userId || !user.password) {
        new $.zui.Messager('请输入用户信息', {
            type: 'warning' // 定义颜色主题
        }).show();
        return
    }
    $.ajax({
        url: "/login",
        type: "post",
        data: JSON.stringify(user),
        dataType: "text",
        contentType: "application/json",
        success: function (data) {
            if (data.includes("错误")) {
                new $.zui.Messager(data, {
                    type: 'danger' // 定义颜色主题
                }).show();
            } else {
                let params = window.location.search.substring(1).split("&")
                let from = ""
                for (let param of params) {
                    if (param.split("=")[0] === "url") {
                        from = param.split("=")[1]
                    }
                }
                localStorage.setItem("token", data)
                location.href = from ? from : "/"
            }
        }
    })
}

function zhuce() {
    $("#username2")[0].value = ''
    $("#password2")[0].value = ''
    $("#password3")[0].value = ''
    $("#yzCodeIn")[0].value = ''
    document.querySelector(".loginBox").style.transform = `rotateY(180deg)`
    document.querySelector(".loginBox").style.height = `350px`
    document.querySelector(".registerBox").style.transform = `rotateY(0deg)`
    document.querySelector("#box").style.margin = `180px auto auto auto`
    loadYzCode()
}

function denglu() {
    $("#username")[0].value = ''
    $("#password")[0].value = ''
    document.querySelector(".checkPwd").innerText = ""
    document.querySelector(".loginBox").style.transform = `rotateY(0deg)`
    document.querySelector(".loginBox").style.height = `300px`
    document.querySelector(".registerBox").style.transform = `rotateY(180deg)`
    document.querySelector("#box").style.margin = `200px auto auto auto`
}


// 验证密码是否合法
function checkPwd() {
    let password = $("#password2")[0].value
    let reg = /^[0-9]*$/
    if (reg.test(password) || password.length < 8) {
        document.querySelector(".checkPwd").innerText = "密码应为八位以上非纯数字组合"
    } else {
        document.querySelector(".checkPwd").innerText = ""
    }
}

//验证手机号是否合法
function checkPhone(ele) {
    ele.value = ele.value.replace(/\D/g, '')
}

// 注册
function register() {
    //判断验证码输入是否正确
    if(yzCode.toLowerCase() !== document.getElementById("yzCodeIn").value.toLowerCase()){
        new $.zui.Messager('验证码错误', {
            type: 'warning' // 定义颜色主题
        }).show();
        return
    }
    let user = {
        userId: $("#username2")[0].value,
        password: $("#password2")[0].value,
        password2: $("#password3")[0].value,
    }
    if (!user.userId || !user.password || !user.password2) {
        new $.zui.Messager('请填写完整', {
            type: 'warning' // 定义颜色主题
        }).show();
        return
    }
    let reg = /^1[3456789]\d{9}$/
    if (!reg.test(user.userId)) {
        new $.zui.Messager('请输入正确的手机号', {
            type: 'warning' // 定义颜色主题
        }).show();
        return
    }
    if (user.password !== user.password2) {
        new $.zui.Messager('密码不一致', {
            type: 'warning' // 定义颜色主题
        }).show();
        return
    }
    if (document.querySelector(".checkPwd").innerText) {
        return
    }
    delete user.password2
    $.ajax({
        url: "/register",
        type: "post",
        data: JSON.stringify(user),
        contentType: "application/json",
        dataType: "text",
        success: function (res) {
            new $.zui.Messager(res, {
                type: res === "注册成功" ? "success" : "danger" // 定义颜色主题
            }).show();
            if (res === "注册成功") {
                denglu()
            }
        }
    })
}

let yzCode = ""
//加载验证码
function loadYzCode(len) {
    len = len || 4
    let canvas = document.getElementById("yzCode")
    let ctx = canvas.getContext('2d')
    ctx.clearRect(0,0,80,30)
    ctx.fillStyle = "rgb(255,255,255)"
    ctx.fillRect(0,0,80,30)
    //生成线条
    for(let i=0;i<4;i++){
        let x1 = Math.floor(Math.random()*canvas.width);
        let y1 = Math.floor(Math.random()*canvas.height);
        let x2 = Math.floor(Math.random()*canvas.width);
        let y2 = Math.floor(Math.random()*canvas.height);
        ctx.beginPath()
        ctx.moveTo(x1,y1)
        ctx.lineTo(x2,y2)
        ctx.closePath()
        ctx.strokeStyle = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`
        ctx.stroke()
    }
    //生成验证码串
    let codeStr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    yzCode = '';
    // 验证码有几位就循环几次
    for (let i = 0; i < len; i++) {
        //生成0-62的随机数
        let ran = Math.floor(Math.random()*62);
        yzCode += codeStr[ran];
        ctx.fillStyle = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`
        ctx.font = "20px 微软雅黑"
        ctx.fillText(codeStr[ran],10+i*15,25)
    }
}
