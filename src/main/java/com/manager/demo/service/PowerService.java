package com.manager.demo.service;


import com.manager.demo.mapper.PowerMapper;
import com.manager.demo.mapper.UserMapper;
import com.manager.demo.pojo.Power;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@Transactional
public class PowerService {

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private PowerMapper powerMapper;


    //根据userId获取用户能访问的所有权限对象
    public List<Power> getUserPower(String userId){
        String powersStr = userMapper.getPowersByUserId(userId);
        return powerMapper.getPowersById(powersStr);
    }

    //分页模糊查询权限
    public HashMap getLikePower(Power power, int size, int page){
        String where = "where 1 = 1 ";
        if(power.getUrl() != null){
            where += " and url like '%" + power.getUrl() + "%'";
        }
        if(power.getDetails() != null){
            where += " and details like '%" + power.getDetails() + "%'";
        }
        if(power.getName() != null){
            where += " and name like '%" + power.getName() + "%'";
        }
        if(power.getType() != null){
            where += " and type like '%" + power.getType() + "%'";
        }
        HashMap res = new HashMap();
        int count = powerMapper.getCount(where);
        List<Power> powers = powerMapper.getPage(size,(page-1)*size,where);
        res.put("count",count);
        res.put("data",powers);
        return res;
    }


    //删除权限
    public int deletePowers(List<Power> powers){
        String ids = "";
        for(Power power:powers){
            ids += ids.equals("") ? power.getId() : "," + power.getId();
        }
        return powerMapper.deletePower(ids);
    }

    //新增获修改
    //传id则为修改,不传id则为新增
    public String savePower(Power power){
        if(power.getId() == null){
            //新增
            powerMapper.addPower(power);
            return "新增成功";
        }else{
            //修改
            powerMapper.editPower(power);
            return "编辑成功";
        }
    }

}
