package com.manager.demo.controller;


import com.manager.demo.pojo.Power;
import com.manager.demo.pojo.Role;
import com.manager.demo.service.DictService;
import com.manager.demo.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;

@RestController
public class RoleController {

    @Autowired
    private RoleService roleService;
    @Autowired
    private DictService dictService;

    //分页查询
    @PostMapping("/getRole")
    public HashMap getPower(@RequestBody Role role, int size,int page){
        return roleService.getLikePower(role,size,page);
    }

    //获取角色可访问的页面
    @GetMapping("/getRolePage")
    public List<Power> getRolePage(HttpServletRequest request){
        int roleId = (int)request.getAttribute("roleId");
        return roleService.getRolePage(roleId);
    }

    //新增获修改
    //传id则为修改,不传id则为新增
    @PostMapping("/saveRole")
    public String saveRole(@RequestBody Role role){
        return roleService.saveRole(role);
    }

    //删除角色
    @PostMapping("/deleteRole")
    public void deletePower(@RequestBody List<Role> roles){
        roleService.deletePower(roles);
    }


    //获取全部角色的字典表
    //id:角色名
    @GetMapping("/getRoleDict")
    public HashMap getRoleDict(){
        return dictService.getRoleDict();
    }

}
