package com.manager.demo.service;


import com.manager.demo.mapper.PowerMapper;
import com.manager.demo.mapper.RoleMapper;
import com.manager.demo.pojo.Power;
import com.manager.demo.pojo.Role;
import org.apache.tomcat.util.buf.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

@Service
@Transactional
public class RoleService {


    @Autowired
    private RoleMapper roleMapper;
    @Autowired
    private PowerMapper powerMapper;


    //分页模糊查询
    public HashMap getLikePower(Role role, int size, int page){
        String where = "where 1 = 1 ";
        if(role.getDetails() != null){
            where += " and details like '%" + role.getDetails() + "%'";
        }
        if(role.getName() != null){
            where += " and name like '%" + role.getName() + "%'";
        }
        HashMap res = new HashMap();
        int count = roleMapper.getCount(where);
        List<Role> roles = roleMapper.getPage(size,(page-1)*size,where);
        //判断该角色权限内是否含有过期权限
        HashMap dataDict = new HashMap();
        for(HashMap map:powerMapper.getAllPowerDict()){
            dataDict.put(Integer.toString((Integer) map.get("id")),map.get("label"));
        }
        for(Role item:roles){
            String[] ids = item.getPower().split(",");
            List<String> temp = new ArrayList<>();
            for(String id:ids){
                //筛选掉过期被删除的权限
                if(dataDict.get(id) != null){
                    temp.add(id);
                }
            }
            item.setPower(StringUtils.join(temp,','));
        }
        res.put("count",count);
        res.put("data",roles);
        return res;
    }

    //获取角色可访问的页面
    public List<Power> getRolePage(int roleId){
        String powers = roleMapper.getPower(roleId);
        return powerMapper.getRolePage(powers);
    }

    //新增获修改
    //传id则为修改,不传id则为新增
    public String saveRole(Role role){
        if(role.getId() == null){
            //新增
            roleMapper.addPower(role);
            return "新增成功";
        }else{
            //修改
            roleMapper.editPower(role);
            return "编辑成功";
        }
    }

    //删除角色
    public void deletePower(List<Role> roles){
        String ids = "";
        for(Role role:roles){
            ids += ids.equals("") ? role.getId() : "," + role.getId();
        }
        roleMapper.deleteRole(ids);
    }

    //判断用户角色是否有访问工具的权限
    public boolean queryToolPower(String tool, int roleId){
        List<String> tools = new ArrayList<>();
        Collections.addAll(tools,roleMapper.getCanTools(roleId).split(","));
        return tools.contains(tool);
    }

}
