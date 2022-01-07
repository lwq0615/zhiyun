package com.manager.demo.controller;


import com.alibaba.fastjson.JSONObject;
import com.manager.demo.mapper.*;
import com.manager.demo.pojo.Event;
import com.manager.demo.pojo.Power;
import com.manager.demo.pojo.User;
import com.manager.demo.service.PowerService;
import com.manager.demo.service.UserService;
import com.manager.demo.tool.Upload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

@RestController
public class UserController {

    @Autowired
    private UserService userService;



    @GetMapping("/")
    public void goo(HttpServletResponse response) throws Exception{
        response.sendRedirect("/home.html");
    }

    @GetMapping("/loginPage.html")
    public ModelAndView login(){
        return new ModelAndView("login");
    }

    //管理
    @GetMapping("/admin.html")
    public ModelAndView learn(){
        return new ModelAndView("admin");
    }

    //    跳转到首页，也用于退出登录
    @GetMapping("/home.html")
    public ModelAndView home(){
        return new ModelAndView("home");
    }

    //检测用户是否有权限查看当前页面
    @GetMapping("/pagePower")
    public boolean pagePower(String url, HttpServletRequest request){
        return userService.pagePower(request,url);
    }

    //用户登录验证
    @PostMapping("/login")
    public String login(@RequestBody User user){
        List<User> result = userService.getUsers(user);
        if(result != null && result.size()>0){
            User users = result.get(0);
            return userService.getUsertoken(users);
        }else{
            return "用户名密码错误";
        }
    }



    //用户注册
    @PostMapping("/register")
    public String register(@RequestBody User data){
        List<User> users = userService.getUsers(data);
        if(users != null && users.size()>0){
            return "该手机号已被注册";
        }
        userService.saveUser(data);
        return "注册成功";
    }


    //分页查询
    @PostMapping("/getUser")
    public HashMap getUser(@RequestBody User user,int size, int page){
        return userService.getLikeUser(user,page,size);
    }

    //删除用户
    @PostMapping("/deleteUser")
    public void deleteUser(@RequestBody List<User> users){
        String ids = "";
        for(User user:users){
            ids += ids.equals("") ? user.getId() : "," + user.getId();
        }
        userService.deleteUsers(ids);
    }

    //新增获修改
    //user.id为空则为新增,否则为修改
    @PostMapping("/saveUser")
    public String saveUser(@RequestBody User user){
        return userService.saveUser(user);
    }

    //获取当前用户的信息
    @GetMapping("/userInfo")
    public HashMap getUserInfo(HttpServletRequest request){
        String userId = (String)request.getAttribute("userId");
        return userService.getUserInfo(userId);
    }

    //首页修改用户信息
    @PostMapping("/updateUser")
    public User updateUser(@RequestBody User user,HttpServletRequest request){
        Integer id = (Integer)request.getAttribute("id");
        user.setId(id);
        userService.saveUser(user);
        return user;
    }

    //上传用户头像
    @PostMapping("/updateUserHead")
    public String updateUserHead(MultipartFile file,HttpServletRequest request) {
        Integer id = (Integer)request.getAttribute("id");
        HashMap res = Upload.uploadPic(file);
        String headImg =  (String) res.get("path") + res.get("fileName");
        User user = new User();
        user.setId(id);
        user.setHeadImg(headImg);
        userService.saveUser(user);
        return headImg;
    }

}
