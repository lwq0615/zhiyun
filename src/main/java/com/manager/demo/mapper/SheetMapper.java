package com.manager.demo.mapper;

import com.manager.demo.pojo.Sheet;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SheetMapper {


    //获取用户歌单列表
    @Select("SELECT * from sheet ${where}")
    List<Sheet> getSheets(String where);

    //新建歌单
    @Insert("INSERT INTO sheet (userId,sheetName,coverImg) values (#{userId},#{sheetName},#{coverImg})")
    int addSheet(Sheet sheet);

    //删除歌单
    @Delete("delete from sheet where id = ${sheetId}")
    int deleteSheet(Integer sheetId);

    //修改歌单名称
    @Update("UPDATE sheet SET ${set} where id = ${id}")
    int editSheet(String set,int id);

}
