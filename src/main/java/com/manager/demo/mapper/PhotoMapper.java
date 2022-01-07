package com.manager.demo.mapper;


import com.manager.demo.pojo.Photo;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Mapper
public interface PhotoMapper {

//    查询图片
    @Select("select * from photo ${where} order by id desc LIMIT #{size} OFFSET #{page}")
    List<Photo> getPhotos(String where,Integer size,Integer page);

//    保存图片信息到数据库
    @Insert("INSERT INTO photo(userId, type, path, fileName) VALUES (#{userId}, #{type}, #{path}, #{fileName})")
    int savePhoto(Photo photo);

//    获取照片总数
    @Select("select count(*) from photo ${where}")
    int getCount(String where);

//    根据相册删除照片
    @Delete("DELETE from photo where type in (${types})")
    int deletePhotosByTypes(String types);

    @Select("select * from photo where type in (${types})")
    List<Photo> getPhotosByTypes(String types);

//    根据照片名删除照片
    @Delete("DELETE from photo where fileName in (${photos})")
    int deletePhotosByNames(String photos);

//    修改照片信息
    @Update("update photo set ${sql} where id = (${id})")
    int editPhoto(String sql,Integer id);

    //根据照片名移动照片到其他相册
    @Update("update photo set type = ${type} where fileName in (${fileNames})")
    int movePhotos(Integer type,String fileNames);

}
