package com.manager.demo.mapper;


import com.manager.demo.pojo.Role;
import org.apache.ibatis.annotations.*;

import java.util.HashMap;
import java.util.List;

@Mapper
public interface RoleMapper {

    //分页查询
    @Select("select * from role ${where} order by id desc LIMIT ${size} OFFSET ${page}")
    List<Role> getPage(int size, int page, String where);

    //查询总记录数
    @Select("select count(*) from role ${where}")
    int getCount(String where);

    //新增角色
    @Insert("insert into role (name,power,details,tools) values (#{name},#{power},#{details},#{tools})")
    int addPower(Role role);

    //编辑权限
    @Update("update role set name = #{name},power = #{power},details = #{details},tools = #{tools} where id = ${id}")
    int editPower(Role role);

    //删除权限
    @Delete("delete from role where id in (${ids})")
    int deleteRole(String ids);

    //根据角色id查询角色权限
    @Select("select power from role where id = ${id}")
    String getPower(Integer id);

    //查询所有角色id与名称字典表
    @Select("select id,name label from role order by id desc")
    List<HashMap> getAllRoleDict();

    //获取角色可使用的工具
    @Select("select tools from role where id = ${roleId}")
    String getCanTools(int roleId);
}
