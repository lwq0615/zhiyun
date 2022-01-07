package com.manager.demo.mapper;


import com.manager.demo.pojo.Power;
import org.apache.ibatis.annotations.*;

import java.util.HashMap;
import java.util.List;

@Mapper
public interface PowerMapper {

    //分页查询列表
    @Select("select * from power ${where} order by id desc LIMIT ${size} OFFSET ${page}")
    List<Power> getPage(int size,int page,String where);

    //查询所有权限id与名称字典表
    @Select("select id,type,CONCAT(name,'(',url,')') label from power order by id desc")
    List<HashMap> getAllPowerDict();

    //查询总记录数
    @Select("select count(*) from power ${where}")
    int getCount(String where);

    //删除权限
    @Delete("delete from power where id in (${ids})")
    int deletePower(String ids);

    //新增权限
    @Insert("insert into power (name,url,details,type) values (#{name},#{url},#{details},#{type})")
    int addPower(Power power);

    //编辑权限
    @Update("update power set name = #{name},url = #{url},details = #{details},type = #{type} where id = ${id}")
    int editPower(Power power);

    //根据id查询权限
    @Select("select url from power where id in (${ids})")
    List<String> getPowersByIds(String ids);

    //根据角色查询角色可访问页面的权限
    @Select("select * from power where type = '访问页面' and id in (${ids})")
    List<Power> getRolePage(String ids);



    //根据权限id查询多个权限信息
    @Select("select * from power where id in (${ids})")
    List<Power> getPowersById(String ids);

}
