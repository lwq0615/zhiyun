package com.manager.demo.mapper;


import com.manager.demo.pojo.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserMapper {

    //创建用户
    @Insert("insert into user (userId,password,role) values(#{userId},#{password},2)")
    int addUser(User User);

    //根据userId获取用户所有的权限id
    @Select("select power from role where id = (select role from user where userId = '${userId}')")
    String getPowersByUserId(String userId);

    //查询用户
    @Select("select * from user ${where}")
    List<User> selectUser(String where);

    //查询总记录数
    @Select("select count(*) from user ${where}")
    int getCount(String where);

    //删除用户
    @Delete("delete from user where id in (${ids})")
    int deleteUsers(String ids);

    //编辑用户
    @Update("update user set ${set} where id = ${id}")
    int editUser(String set,int id);


}
