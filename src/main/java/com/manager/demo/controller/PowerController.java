package com.manager.demo.controller;


import com.manager.demo.pojo.Power;
import com.manager.demo.service.DictService;
import com.manager.demo.service.PowerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;

@RestController
public class PowerController {


    @Autowired
    private PowerService powerService;
    @Autowired
    private DictService dictService;


    //分页查询
    @PostMapping("/getPower")
    public HashMap getPower(@RequestBody Power power,int size, int page){
        return powerService.getLikePower(power,size,page);
    }

    //获取全部权限的字典表
    //id:权限名(权限路径)
    @GetMapping("/getPowerDict")
    public HashMap getPowerDict(){
        return dictService.getPowerDict();
    }

    //删除权限
    @PostMapping("/deletePower")
    public void deletePower(@RequestBody List<Power> powers){
        powerService.deletePowers(powers);
    }

    //新增获修改
    //传id则为修改,不传id则为新增
    @PostMapping("/savePower")
    public String savePower(@RequestBody Power power){
        return powerService.savePower(power);
    }

}
