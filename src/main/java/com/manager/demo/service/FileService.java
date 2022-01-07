package com.manager.demo.service;


import com.manager.demo.mapper.FileMapper;
import com.manager.demo.pojo.ZFile;
import org.apache.tomcat.util.buf.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class FileService {

    @Autowired
    private FileMapper fileMapper;


    //保存文件到数据库
    //返回值为文件在数据库的id
    public int saveFile(ZFile zFile){
        fileMapper.saveFile(zFile);
        return fileMapper.getFiles("where path = '"+zFile.getPath()+"'").get(0).getId();
    }

    //查询文件
    public List<ZFile> getFiles(ZFile zFile){
        String where = " where 1 = 1 ";
        if(zFile.getId() != null){
            where += " and id = "+zFile.getId();
        }
        if(zFile.getPath() != null){
            where += " and path = '"+zFile.getPath()+"'";
        }
        if(zFile.getName() != null){
            where += " and name = '"+zFile.getName()+"'";
        }
        if(zFile.getSize() != 0){
            where += " and size = '"+zFile.getSize()+"'";
        }
        return fileMapper.getFiles(where);
    }


    //根据id查询文件信息
    public List<ZFile> getFiles(List<String> ids){
        if(ids.size() != 0){
            String id = StringUtils.join(ids,',');
            return fileMapper.getFiles("where id in ("+id+")");
        }else {
            return new ArrayList<>();
        }
    }

    //删除文件
    public int deleteFiles(List<ZFile> files){
        if(files.size() > 0){
            List<String> ids = new ArrayList<>();
            for (ZFile file : files) {
                ids.add(String.valueOf(file.getId()));
            }
            return fileMapper.deleteFiles(StringUtils.join(ids,','));
        }else{
            return 0;
        }
    }

}
