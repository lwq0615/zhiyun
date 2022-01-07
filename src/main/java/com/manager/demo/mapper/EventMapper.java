package com.manager.demo.mapper;


import com.manager.demo.pojo.Event;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface EventMapper {

    //新增日历事件
    @Insert("insert into event (title,detail,date,time,imgs,files,userId) values (#{title},#{detail},#{date},#{time},#{imgs},#{files},#{userId})")
    int addEvent(Event event);

    //查询用户日历事件
    @Select("select * from event ${where}")
    List<Event> getEvents(String where);

    //修改用户日历事件
    @Update("update event set title=#{title},detail=#{detail},date=#{date},time=#{time},imgs=#{imgs},files=#{files} where id = ${id}")
    int updateEvent(Event event);

    //删除日历事件
    @Delete("delete from event where id = ${id}")
    int deleteEvent(int id);

}
