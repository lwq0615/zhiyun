//发送请求
export const request = function (params, type) {
    let token = wx.getStorageSync('token')
    if (!params.header) {
        params.header = {}
    }
    params.url = getApp().globalData.URL + params.url
    if (token) {
        params.header.token = token
    }
    params.header["content-type"] = params.header["content-type"] || "application/json"
    params.dataType = params.dataType || "json"
    return new Promise((resolve, reject) => {
        Object.assign(params, {
            success(res) {
                switch (res.statusCode) {
                    case 401: {
                        wx.showToast({
                            title: '请先登录',
                            icon: "error"
                        })
                        wx.removeStorageSync('token')
                        setTimeout(function () {
                            wx.reLaunch({
                                url: "/pages/login/login"
                            })
                        }, 1000)
                        break
                    }
                    case 402: {
                        wx.showToast({
                            title: '登录过期,请重新登录',
                            icon: "none"
                        })
                        wx.removeStorageSync('token')
                        setTimeout(function () {
                            wx.reLaunch({
                                url: "/pages/login/login"
                            })
                        }, 1000)
                        break
                    }
                    case 403: {
                        wx.showToast({
                            title: '没有权限',
                            icon: "error"
                        })
                        break
                    }
                    case 500: {
                        wx.showToast({
                            title: '服务器内部错误',
                            icon: "error"
                        })
                        break
                    }
                }
                resolve(res)
            },
            fail(err) {
                reject(err)
            }
        })
        if (type) {
            wx[type](params)
        } else {
            wx.request(params)
        }
    })
}
