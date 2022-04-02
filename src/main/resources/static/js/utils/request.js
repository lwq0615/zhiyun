/**
 * 请求封装
 * @param params
 * @returns {Promise<any>}
 */
function request(params) {
    params.contentType = params.contentType === null || params.contentType === undefined ? "application/json" : params.contentType
    let token = localStorage.getItem('token')
    if(params.type === "post" && params.contentType === "application/json"){
        params.data = JSON.stringify(params.data)
    }
    return new Promise((resolve,reject) => {
        Object.assign(params,{
            beforeSend: function (XMLHttpRequest) {
                if(token){
                    XMLHttpRequest.setRequestHeader("token", token);
                }
            },
            success(res){
                resolve(res)
            },
            error(err){
                switch (err.status) {
                    case 400:{
                        new $.zui.Messager("请求有误", {
                            type: 'danger' // 定义颜色主题
                        }).show();
                        break
                    }
                    case 401:{
                        new $.zui.Messager("请先登录", {
                            type: 'warning' // 定义颜色主题
                        }).show();
                        setTimeout(function () {
                            location.href = "/loginPage.html?url="+window.location.pathname
                        },1000)
                        break
                    }
                    case 402:{
                        new $.zui.Messager("登录过期，请重新登录", {
                            type: 'warning' // 定义颜色主题
                        }).show();
                        setTimeout(function () {
                            localStorage.removeItem("token")
                            location.href = "/loginPage.html?url="+window.location.pathname
                        },1000)
                        break
                    }case 403:{
                        new $.zui.Messager("没有权限", {
                            type: 'warning' // 定义颜色主题
                        }).show();
                        break
                    }
                    case 500:{
                        new $.zui.Messager("服务器内部错误", {
                            type: 'danger' // 定义颜色主题
                        }).show();
                        break
                    }
                }
                reject(err)
            }
        })
        $.ajax(params)
    })
}

//检测用户是否登录和有没有权限访问当前页面
if(location.pathname !== "/home.html"){
    request({
        url: "/pagePower?url="+location.pathname,
        type: "get"
    }).then(res => {
        if(!res){
            //判断用户是否有权限访问该页面
            location.href = "/home.html?msg="+"没有权限"
        }
    })
}
