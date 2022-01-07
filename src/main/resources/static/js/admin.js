
// 手动通过点击模拟高亮菜单项
$('#treeMenu').on('click', 'a', function() {
    $('#treeMenu li.active').removeClass('active');
    $(this).closest('li').addClass('active');
});

//选中的数据
let checkDatas = []
//分页信息
let page = {
    page: 1,
    size: 10,
    params: {}
}

//生成表格头和条件搜索
function createTable(params) {
    page.params = params
    document.getElementById("addBtn").style.display = params.add ? "" : "none"
    let options = params.options
    document.getElementById("showBox").style.display = "block"
    //清空原来的标题
    document.getElementById("search").innerHTML = ""
    let tableHead = document.getElementById("tableHead")
    tableHead.innerHTML = ""
    //清空搜索条件
    searchData = {}
    let checkBox = $(`<input type='checkbox' id="checkAll"/>`)
    //绑定全选按钮的事件
    checkBox.change(function () {
        for(let ele of document.querySelectorAll("#tableBody tr td input")){
            if(this.checked){
                //全选
                if(!ele.checked){
                    ele.click()
                }
            }else{
                //全不选
                if(ele.checked){
                    ele.click()
                }
            }
        }
    })
    //添加标题头
    let tr = $("<tr></tr>").append($(`<th style='width: 35px;text-align: center'></th>`).append(checkBox))
    for(let option of options){
        if(option.show === false){
            continue
        }
        //表格字段名
        tr.append($(`<th style="min-width: ${option.width || '100px'}">${option.text}</th>`))
        //条件查询
        if(option.search){
            let div = $(`<div style="width: 100%;display: flex;justify-content: center;align-items: center"></div>`)
            div.append($(`<h5 style="display: inline-block;width: 15%">${option.text}</h5>`))
            let input = null
            //根据option的type选择输入模板
            if(option.type === "input" || option.type === "textarea"){
                input = $(`<input type="text" style="border-radius: 2px;border: 1px solid #DDDDDD;height: 30px;width: 75%;padding-left: 5px"/>`)
            }else if(option.type === "select"){
                input = $(`<select style="border: 1px solid #dddddd;border-radius: 2px;width: 75%;height: 30px;padding-left: 5px"></select>`)
                request({
                    url: option.dictURL,
                    type: "get",
                    dataType: "json"
                }).then(res => {
                    for(let key of Object.keys(res.dataDict)){
                        input.append($(`<option value="${key}">${res.dataDict[key]}</option>`))
                    }
                })
            }else{
                continue
            }
            input.attr("name","search")
            input.attr("data-name",option.name)
            input.on("keydown",function (e) {
                if(e.keyCode === 13){
                    searchDatas()
                }
            })
            div.append(input)
            $("#search").append(div)
        }
    }
    tr.append($(`<th style="min-width: 130px;position: sticky;right: 0;background-color: whitesmoke">操作</th>`))
    $("#tableHead").append(tr)
    getPage(page.page,page.size)
}


//获取表格内分页数据
function getPage(page1,size1) {
    page.page = page1
    page.size = size1
    //请求获得新页面数据
    //根据page.params不同使用不一样的接口
    let url = `${page.params.getPageURL}?size=${page.size}&page=${page.page}`
    request({
        url: url,
        type: "post",
        data: searchData || {},
        contentType: "application/json",
        dataType: "json"
    }).then(async function (res) {
        //清空选中的数据
        checkDatas = []
        //清空原来的数据
        document.getElementById("tableBody").innerHTML = ""
        let data = res.data
        $('#myPager').data('zui.pager').set(page.page,res.count,page.size);
        //获取表格各个字段信息
        //根据字段展示值
        for(let i=0;i<data.length;i++){
            let checkBox = $(`<input type='checkbox'/>`)
            //绑定表格内数据选中的方法
            checkBox.change(function () {
                if(this.checked){
                    checkDatas.push(data[i])
                }else{
                    checkDatas.splice(checkDatas.indexOf(data[i]),1)
                }
            })
            let tr = $("<tr style='height: 35px'></tr>").append($(`<td style='text-align: center;vertical-align: middle;'></td>`).append(checkBox))
            //存放checkbox的key-value字典
            let dict = {}
            for(let option of page.params.options){
                //如果配置字段不显示则跳过
                if(option.show === false){
                    continue
                }
                //字段类型为checkbox,select,则需要映射
                if(option.type === "checkbox" || option.type === "select"){
                    //加载该复选框对应的字典
                    if(!dict[option.name]){
                        await request({
                            url: option.dictURL,
                            type: "get",
                            dataType: "json"
                        }).then(res => {
                            dict[option.name] = res.dataDict
                        })
                    }
                    let str = []
                    //将key映射在做展示
                    if(data[i][option.name]){
                        for(let id of data[i][option.name].toString().split(",")){
                            if(dict[option.name][id]){
                                str.push(dict[option.name][id])
                            }
                        }
                    }
                    tr.append($(`<td style="vertical-align: middle;"><div class="table-td">${str.join(",")}</div></td>`))
                }else{
                    tr.append($(`<td style="vertical-align: middle;"><div class="table-td"> ${data[i][option.name] || ""}</div></td>`))
                }
            }
            //操作栏添加按钮
            let caozuo = $(`<td style="position: sticky;right: 0;background-color: whitesmoke;vertical-align: middle;"></td>`)
            if(page.params.edit){
                let editBtn = $(`<button class="btn btn-primary" type="button" style="margin-right: 8px">编辑</button>`)
                editBtn.click(function () {
                    addOrEditDialog(data[i])
                })
                caozuo.append(editBtn)
            }
            let deleteBtn = $(`<button class="btn btn-danger" type="button">删除</button>`)
            deleteBtn.click(function () {
                deleteDatas([data[i]])
            })
            caozuo.append(deleteBtn)
            tr.append(caozuo)
            $("#tableBody").append(tr)
        }
    })
}

//删除数据
function deleteDatas(datas){
    if(datas.length){
        let bool = confirm("确定要删除吗?")
        let url = page.params.deleteURL
        if (bool){
            request({
                url: url,
                type: "post",
                data: datas,
                contentType: "application/json"
            }).then(res => {
                new $.zui.Messager("删除成功", {
                    type: 'success' // 定义颜色主题
                }).show();
                getPage(page.page,page.size)
                if(document.getElementById("checkAll").checked){
                    document.getElementById("checkAll").click()
                }
            })
        }
    }
}



//新增与编辑对话框
$('#addOrEditDialog').modal({
    keyboard: true,
    moveable: true,
    position: "fit",
    rememberPos: true,
    show: false
})

let checkDict = {}
//新增和编辑弹窗
function addOrEditDialog(data) {
    //弹窗展示字段
    let body = document.querySelector("#addOrEditDialog .modal-body>div")
    body.innerHTML = ""
    //存放checkbox选中的数据
    checkDict = {}
    for(let option of page.params.options){
        if(!option.addShow && !data){
            continue
        }
        //存放每个字段名和字段值的盒子
        let div = document.createElement("div")
        // 字段名
        let label = document.createElement("h5")
        label.style = "display: inline-block;width: 60px"
        label.innerText = option.text
        div.appendChild(label)
        //字段值的展示
        let input = null
        //根据option的type选择字段值模板
        if(option.type === "input"){
            input = document.createElement("input")
            input.type = "text"
            input.name = option.name
            input.style = "border-radius: 2px;border: 1px solid #DDDDDD;height: 30px;width: 160px;padding-left: 5px"
        }else if(option.type === "textarea"){
            input = document.createElement("textarea")
            input.rows = 3
            input.name = option.name
            input.style = "border-radius: 2px;border: 1px solid #DDDDDD;width: 160px;padding-left: 5px"
        }else if(option.type === "checkbox"){
            checkDict[option.name] = data && data[option.name] ? data[option.name].split(",") : []
            input = document.createElement("a")
            input.style = "color: #3280fc;font-size: 14px;width: 160px;display: inline-block"
            input.setAttribute("data-toggle","modal")
            input.href = "#checkBoxDialog"
            input.innerText = "选择"
            input.onclick = function(){
                let checkBoxDialog = document.querySelector("#checkBoxDialog .modal-body div#checkBox")
                checkBoxDialog.innerHTML = ""
                request({
                    url: option.dictURL,
                    type: "get",
                    dataType: "json"
                }).then(res => {
                    if(option.group && res.typeDict){
                        //所有分组的的input对象
                        let groupCheckboxs= []
                        //全选按钮
                        let checkAllDiv = document.createElement("div")
                        let checkAll = document.createElement("input")
                        let text = document.createElement("span")
                        checkAllDiv.style = "grid-column: 1 / 4;padding-left: 5px;display: flex;"
                        text.innerText = "全选"
                        text.style = "font-weight: 700;font-size: 14px;"
                        checkAll.type = "checkbox"
                        checkAll.onchange = function(){
                            if(this.checked){
                                //全选所有分组
                                groupCheckboxs.forEach(item => {
                                    item.checked ? null : item.click()
                                })
                            }else{
                                //全不选所有分组
                                groupCheckboxs.forEach(item => {
                                    item.checked ? item.click() : null
                                })
                            }
                        }
                        checkAllDiv.appendChild(checkAll)
                        checkAllDiv.appendChild(text)
                        checkBoxDialog.appendChild(checkAllDiv)
                        //如果开启了group并且接口返回了相应的字典，则对多选框进行分组
                        let groups = Object.keys(res.typeDict)
                        //遍历checkbox分组
                        for(let group of groups){
                            //所有checkbox的的input对象
                            let itemCheckboxs= []
                            //分组的全选按钮
                            let checkGroupDiv = document.createElement("div")
                            let checkGroup = document.createElement("input")
                            let groupText = document.createElement("span")
                            checkGroupDiv.style = "grid-column: 1 / 4;background-color: #dddddd;padding-left: 5px;display: flex;"
                            checkGroup.type = "checkbox"
                            groupText.innerText = group
                            groupText.style = "font-weight: 600;"
                            checkGroupDiv.appendChild(checkGroup)
                            checkGroupDiv.appendChild(groupText)
                            checkBoxDialog.appendChild(checkGroupDiv)
                            checkGroup.onchange = function(){
                                if(this.checked){
                                    //全选所有分组
                                    itemCheckboxs.forEach(item => {
                                        item.checked ? null : item.click()
                                    })
                                }else{
                                    //全不选所有分组
                                    itemCheckboxs.forEach(item => {
                                        item.checked ? item.click() : null
                                    })
                                }
                            }
                            groupCheckboxs.push(checkGroup)
                            //分组下的checkbox
                            res.typeDict[group].forEach(item => {
                                let itemDiv = document.createElement("div")
                                let itemInput = document.createElement("input")
                                let itemText = document.createElement("span")
                                itemInput.type = "checkbox"
                                itemDiv.style = "display: flex;padding-left: 5px"
                                itemText.innerText = res.dataDict[item]
                                itemDiv.appendChild(itemInput)
                                itemDiv.appendChild(itemText)
                                checkBoxDialog.appendChild(itemDiv)
                                itemInput.onchange = function(){
                                    if(this.checked){
                                        //选择
                                        if(!checkDict[option.name].includes(item)){
                                            checkDict[option.name].push(item)
                                        }
                                    }else{
                                        //取消选择
                                        if(checkDict[option.name].includes(item)){
                                            checkDict[option.name].splice(checkDict[option.name].indexOf(item),1)
                                        }
                                    }
                                    let chackGroupFlg = true
                                    for(let item of res.typeDict[group]){
                                        if(!checkDict[option.name].includes(item)){
                                            chackGroupFlg = false
                                        }
                                    }
                                    //每个checkbox都选中，group的全选按钮也跟随改变
                                    if(chackGroupFlg && !checkGroup.checked){
                                        checkGroup.checked = true
                                    }
                                    //checkbox没有全部选中，group的全选按钮也跟随改变
                                    if(!chackGroupFlg && checkGroup.checked){
                                        checkGroup.checked = false
                                    }
                                    let allLen = Object.keys(res.dataDict).length
                                    //每个checkbox都选中，全选按钮也跟随改变
                                    if(allLen === checkDict[option.name].length && !checkAll.checked){
                                        checkAll.checked = true
                                    }
                                    //checkbox没有全部选中，全选按钮也跟随改变
                                    if(allLen !== checkDict[option.name].length && checkAll.checked){
                                        checkAll.checked = false
                                    }
                                }
                                if(checkDict[option.name].includes(item) && !itemInput.checked){
                                    itemInput.click()
                                }
                                itemCheckboxs.push(itemInput)
                            })
                        }
                    }
                    else{
                        //不分组，直接倒序遍历数据
                        //所有checkbox的的input对象
                        let itemCheckboxs= []
                        //全选按钮
                        let checkAllDiv = document.createElement("div")
                        let checkAll = document.createElement("input")
                        let text = document.createElement("span")
                        checkAllDiv.style = "grid-column: 1 / 4;padding-left: 5px;display: flex;"
                        text.innerText = "全选"
                        text.style = "font-weight: 700;font-size: 14px;"
                        checkAll.type = "checkbox"
                        checkAll.onchange = function(){
                            if(this.checked){
                                //全选所有分组
                                itemCheckboxs.forEach(item => {
                                    item.checked ? null : item.click()
                                })
                            }else{
                                //全不选所有分组
                                itemCheckboxs.forEach(item => {
                                    item.checked ? item.click() : null
                                })
                            }
                        }
                        checkAllDiv.appendChild(checkAll)
                        checkAllDiv.appendChild(text)
                        checkBoxDialog.appendChild(checkAllDiv)
                        let keys = Object.keys(res.dataDict)
                        keys.forEach(key => {
                            let itemDiv = document.createElement("div")
                            let itemInput = document.createElement("input")
                            let itemText = document.createElement("span")
                            itemInput.type = "checkbox"
                            itemDiv.style = "display: flex;padding-left: 5px"
                            itemText.innerText = res.dataDict[key]
                            itemDiv.appendChild(itemInput)
                            itemDiv.appendChild(itemText)
                            checkBoxDialog.appendChild(itemDiv)
                            itemInput.onchange = function(){
                                if(this.checked){
                                    //选择
                                    if(!checkDict[option.name].includes(key)){
                                        checkDict[option.name].push(key)
                                    }
                                }else{
                                    //取消选择
                                    if(checkDict[option.name].includes(key)){
                                        checkDict[option.name].splice(checkDict[option.name].indexOf(key),1)
                                    }
                                }
                                let allLen = Object.keys(res.dataDict).length
                                //每个checkbox都选中，全选按钮也跟随改变
                                if(allLen === checkDict[option.name].length && !checkAll.checked){
                                    checkAll.checked = true
                                }
                                //checkbox没有全部选中，全选按钮也跟随改变
                                if(allLen !== checkDict[option.name].length && checkAll.checked){
                                    checkAll.checked = false
                                }
                            }
                            if(checkDict[option.name].includes(key) && !itemInput.checked){
                                itemInput.click()
                            }
                            itemCheckboxs.push(itemInput)
                        })
                    }
                })
            }
        }else if(option.type === "select"){
            input = document.createElement("select")
            input.style = "border-radius: 2px;border: 1px solid #DDDDDD;height: 30px;width: 160px;padding-left: 5px"
            input.name = option.name
            request({
                url: option.dictURL,
                type: "get",
                dataType: "json"
            }).then(res => {
                for(let key of Object.keys(res.dataDict)){
                    let option = document.createElement("option")
                    option.value = key
                    option.innerText = res.dataDict[key]
                    input.appendChild(option)
                }
                input.value = data[option.name]
            })
        }
        if(data){
            //编辑弹窗
            input.value = data[option.name]
        }
        //不允许编辑
        if(!option.edit && data){
            input.disabled = !option.edit
        }
        div.appendChild(input)
        body.appendChild(div)
    }
    $('#addOrEditDialog').modal('show', 'fit')
}


//新增和编辑
function addOrEdit() {
    let data = {}
    for(let option of page.params.options){
        if(["input","textarea","select"].includes(option.type)){
            let ele = document.querySelector(`#addOrEditDialog .modal-body ${option.type}[name='${option.name}']`)
            if(option.must && !ele.value){
                new $.zui.Messager("请填写"+option.text, {
                    type: 'warning' // 定义颜色主题
                }).show();
                return
            }
            if(ele && ele.value){
                data[option.name] = ele.value
            }
        }else if(option.type === "checkbox"){
            data[option.name] = checkDict[option.name].sort().join(",")
        }
    }
    let url = page.params.saveURL
    request({
        url: url,
        type: "post",
        data: data,
        contentType: "application/json"
    }).then(res => {
        new $.zui.Messager(res, {
            type: 'success' // 定义颜色主题
        }).show();
        getPage(page.page,page.size)
        $('#addOrEditDialog').modal('hide', 'fit')
    })
}

//分页器初始化
$('#myPager').pager({
    page: 1,
    lang:'zh_cn',
    onPageChange: function(state, oldState) {
        //页码改变触发事件
        if(state.page !== oldState.page){
            getPage(state.page,page.size)
        }
    },
});

//条件查询
let searchData = {}
function searchDatas() {
    searchData = {}
    for(let ele of document.querySelectorAll("#search *[name='search']")){
        if(ele.value){
            searchData[ele.getAttribute("data-name")] = ele.value
        }
    }
    getPage(1,page.size)
}

//点击权限配置
function setPower(){
    let params = {
        add: true,
        edit: true,
        deleteURL: "/deletePower",
        getPageURL: "/getPower",
        saveURL: "/savePower",
        options: [
            {
                name: "id",
                type: "input",
                text: "id",
                width: "80px"
            },
            {
                name: "name",
                type: "input",
                text: "权限名称",
                must: true,
                width: "200px",
                search: true,
                edit: true,
                addShow: true
            },
            {
                name: "type",
                type: "input",
                text: "类别",
                width: "140px",
                search: true,
                must: true,
                edit: true,
                addShow: true
            },
            {
                name: "url",
                type: "input",
                text: "权限路径",
                width: "200px",
                search: true,
                edit: true,
                addShow: true
            },
            {
                name: "details",
                type: "textarea",
                text: "描述",
                search: true,
                edit: true,
                addShow: true
            }
        ]
    }
    createTable(params)
}

//点击角色管理
function setRole(){
    let params = {
        //开启新增按钮
        add: true,
        //开启编辑按钮
        edit: true,
        //删除的接口
        deleteURL: "/deleteRole",
        //获取页面数据的接口
        getPageURL: "/getRole",
        //新增和修改的接口
        saveURL: "/saveRole",
        options: [
            {
                name: "id",
                type: "input",
                text: "id",
                width: "80px"
            },
            {
                name: "name",
                type: "input",
                text: "角色名称",
                must: true,
                width: "140px",
                search: true,
                edit: true,
                addShow: true
            },
            {
                name: "power",
                type: "checkbox",
                //type为checkbox时需要提供字典请求地址
                //字典返回值格式为
                // {
                //     dataDict: {value: lable,....},
                //     typeDict:{类别名: [value1,value2,....]}
                // }
                dictURL: "/getPowerDict",
                //对每个选项进行分类，只对checkbox有效，接口中也需要提供对应的字典
                //开启group后字典返回值必须有typeDict
                group: true,
                text: "角色权限",
                width: "500px",
                edit: true,
                addShow: true
            },
            {
                name: "tools",
                type: "checkbox",
                //type为checkbox时需要提供字典请求地址
                dictURL: "/tools/getToolDict",
                text: "可用工具",
                width: "300px",
                edit: true,
                addShow: true
            },
            {
                name: "details",
                type: "textarea",
                text: "角色描述",
                width: "500px",
                search: true,
                edit: true,
                addShow: true
            }
        ]
    }
    createTable(params)
}

//点击用户管理
function setUser(){
    let params = {
        edit: true,
        add: true,
        deleteURL: "/deleteUser",
        getPageURL: "/getUser",
        saveURL: "/saveUser",
        options: [
            {
                name: "id",
                type: "input",
                text: "id",
                width: "80px"
            },
            {
                name: "userId",
                type: "input",
                text: "账号",
                width: "150px",
                search: true,
                addShow: true
            },
            {
                name: "password",
                type: "input",
                text: "用户密码",
                must: true,
                width: "150px",
                edit: true,
                show: false,
                addShow: true
            },
            {
                name: "role",
                type: "select",
                dictURL: "/getRoleDict",
                text: "角色",
                width: "150px",
                edit: true,
                search: true,
                addShow: true
            }
        ]
    }
    createTable(params)
}