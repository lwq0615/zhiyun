package com.manager.demo.mapper;


import com.manager.demo.pojo.Album;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AlbumMapper {

    //条件查询相册信息
    @Select("select * from album ${where}")
    List<Album> getAlbums(String where);

    //新建相册
    @Insert("insert into album (name,userId) values (#{name},#{userId})")
    int addAlbum(Album album);

    //删除相册
    @Delete("delete from album where id in (${ids})")
    int deleteAlbums(String ids);

    //编辑相册
    @Update("update album ${set} where id = ${id}")
    int updateAlbum(Integer id,String set);

}
