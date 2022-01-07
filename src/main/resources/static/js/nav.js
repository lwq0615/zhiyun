
//导航栏数据
let navData = [
    {
        label: "首页",
        url: "/home.html"
    }
]

let userInfo = {}

//生成导航栏
function createNav(navData) {
    let url = location.pathname
    let nav = document.querySelector(".zc-nav")
    let ul_li = ""
    navData.forEach(item => {
        ul_li += `<li class="${item.url === url ? 'active' : ''}"><a href="${item.url}" style="color: white;">${item.label}</a></li>`
    })
    nav.innerHTML = `
        <nav class="navbar navbar-inverse" role="navigation" style="margin-bottom: 0">
            <div class="container-fluid">
                <div class="navbar-header">
                    <ul class="nav nav-pills" style="margin-top: 2px">
                        ${ul_li}
                    </ul>
                </div>
                <!-- 导航项目 -->
                <div class="collapse navbar-collapse navbar-collapse-example">
                    <!-- 右侧的导航项目 -->
                    <ul class="nav navbar-nav navbar-right">
                    <li><a href="/home">帮助</a></li>
                    <li class="dropdown">
                        <a class="dropdown-toggle" data-toggle="dropdown" id="person">个人信息<b class="caret"></b></a>
                        <a href="/loginPage.html" id="login">登录</a>
                        <ul class="dropdown-menu" role="menu">
                            <li><a href="/home.html" style="text-align: right">
                                <b style="float: left">用户：</b>${userInfo.userName}
                            </a></li>
                            <li><a href="/home.html" style="text-align: right">
                                <b style="float: left">ID：</b>${userInfo.userId}
                            </a></li>
                            <li class="divider"></li>
                            <li><a href="javascript:localStorage.removeItem('token');location.href='/home.html'"><b>退出登录</b></a></li>
                        </ul>
                    </li>
                </ul>
                </div>
            </div>
        </nav>
    `
    //判断是否登录显示登录按钮
    if(localStorage.getItem("token")){
        document.getElementById("person").style.display = ""
        document.getElementById("login").style.display = "none"
    }else{
        document.getElementById("person").style.display = "none"
        document.getElementById("login").style.display = ""
    }
}

if(localStorage.getItem("token")){
    //有登录则根据用户角色动态生成导航
    request({
        url: "/getRolePage",
        type: "get"
    }).then(res => {
        let admin = null
        for(let item of res){
            if(item.name === "管理"){
                admin = {
                    label: item.name,
                    url: item.url
                }
                continue
            }
            navData.push({
                label: item.name,
                url: item.url
            })
        }
        admin ? navData.push(admin) : null
        request({
            url: "/userInfo",
            type: "get"
        }).then( res => {
            userInfo = res
            createNav(navData)
        })
    })
}else{
    //如果没有登录则只展示首页
    createNav(navData)
}

