package com.manager.demo.service;


import com.manager.demo.mapper.DictMapper;
import com.manager.demo.mapper.PowerMapper;
import com.manager.demo.mapper.RoleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@Transactional
public class DictService {


    @Autowired
    private DictMapper dictMapper;
    @Autowired
    private PowerMapper powerMapper;
    @Autowired
    private RoleMapper roleMapper;


    //获取工具列表字典表
    public HashMap getToolDict(){
        HashMap res = new HashMap();
        HashMap dataDict = new HashMap();
        List<HashMap> dicts = dictMapper.getToolDict();
        for (HashMap dict : dicts) {
            dataDict.put(dict.get("value"),dict.get("label"));
        }
        res.put("dataDict",dataDict);
        return res;
    }


    //获取全部权限的字典表
    public HashMap getPowerDict(){
        HashMap res = new HashMap();
        HashMap dataDict = new HashMap();
        HashMap typeDict = new HashMap();
        for(HashMap map:powerMapper.getAllPowerDict()){
            dataDict.put(Integer.toString((Integer) map.get("id")),map.get("label"));
            if(typeDict.get(map.get("type")) == null){
                typeDict.put(map.get("type"),new ArrayList<>());
            }
            List<String> arr = (ArrayList)typeDict.get(map.get("type"));
            arr.add(Integer.toString((Integer) map.get("id")));
        }
        //id:权限名(权限路径)
        res.put("dataDict",dataDict);
        //类名：权限数组
        res.put("typeDict",typeDict);
        return res;
    }


    //获取全部角色的字典表
    //id:角色名
    public HashMap getRoleDict(){
        HashMap res = new HashMap();
        HashMap dataDict = new HashMap();
        for(HashMap map:roleMapper.getAllRoleDict()){
            dataDict.put(Integer.toString((Integer) map.get("id")),map.get("label"));
        }
        res.put("dataDict",dataDict);
        return res;
    }


}
