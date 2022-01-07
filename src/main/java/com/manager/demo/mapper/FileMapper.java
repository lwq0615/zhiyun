package com.manager.demo.mapper;


import com.manager.demo.pojo.ZFile;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface FileMapper {


    //上传文件到服务器后写入数据库
    @Insert("insert into file (path,name,size) values (#{path},#{name},${size})")
    int saveFile(ZFile zFile);

    //查询
    @Select("select * from file ${where}")
    List<ZFile> getFiles(String where);

    //删除
    @Delete("delete from file where id in (${ids})")
    int deleteFiles(String ids);

}
