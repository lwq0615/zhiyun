package com.manager.demo.controller;


import com.manager.demo.service.DictService;
import com.manager.demo.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;

@RestController
public class ToolController {


    @Autowired
    private RoleService roleService;
    @Autowired
    private DictService dictService;

    @GetMapping("/tools.html")
    public ModelAndView tools(){
        return new ModelAndView("tools");
    }

    //获取工具列表字典表
    @GetMapping("/tools/getToolDict")
    public HashMap getToolDict(){
        return dictService.getToolDict();
    }

    //判断用户是否有访问工具的权限
    @GetMapping("/tools/queryToolPower")
    public boolean queryToolPower(String tool,HttpServletRequest request){
        int roleId = (int)request.getAttribute("roleId");
        return roleService.queryToolPower(tool,roleId);
    }

}
