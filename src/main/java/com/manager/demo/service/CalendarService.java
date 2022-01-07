package com.manager.demo.service;


import com.manager.demo.mapper.EventMapper;
import com.manager.demo.pojo.Event;
import com.manager.demo.pojo.ZFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class CalendarService {


    @Autowired
    private EventMapper eventMapper;
    @Autowired
    private FileService fileService;


    //保存日历事件
    public int saveEvent(Event data){
        if(data.getId() == null){
            //新增
            return eventMapper.addEvent(data);
        }else{
            //修改
            //获取旧的事件记录
            List<String> newImgs = new ArrayList<>();
            Collections.addAll(newImgs,data.getImgs().split(","));
            //event为旧的事件记录
            Event event = eventMapper.getEvents(" where id = "+data.getId()).get(0);
            if(event.getImgs() != null){
                String[] oldImgs = event.getImgs().split(",");
                //如果新的imgs内不包含旧的img，则将服务器对应的存储文件删除
                for (String oldImg : oldImgs) {
                    if(!newImgs.contains(oldImg)){
                        //不包含,根据oldImg删除
                        //oldImg为图片在服务器的存储路径
                        File file = new File(oldImg);
                        if(file.exists()){
                            file.delete();
                        }
                    }
                }
            }
            return eventMapper.updateEvent(data);
        }
    }

    //获取日历事件
    public List<Event> getEvents(Event event){
        String where = "where 1 = 1 ";
        if(event.getId() != null){
            where += " and id = " + event.getId();
        }
        if(event.getImgs() != null){
            where += " and imgs = '" + event.getImgs() + "'";
        }
        if(event.getDate() != null){
            where += " and date = '" + event.getDate() + "'";
        }
        if(event.getDetail() != null){
            where += " and detail = '" + event.getDetail() + "'";
        }
        if(event.getFiles() != null){
            where += " and files = '" + event.getFiles() + "'";
        }
        if(event.getTime() != null){
            where += " and time = '" + event.getTime() + "'";
        }
        if(event.getTitle() != null){
            where += " and title = '" + event.getTitle() + "'";
        }
        if(event.getUserId() != null){
            where += " and userId = '" + event.getUserId() + "'";
        }
        return eventMapper.getEvents(where);
    }


    //删除日历事件
    public int deleteEvent(int id){
        Event event = eventMapper.getEvents(" where id = "+id).get(0);
        //从服务器删除存储的图片
        String imgs = event.getImgs();
        String files = event.getFiles();
        if(imgs != null && !imgs.equals("")){
            for (String path : imgs.split(",")) {
                File file = new File(path);
                if (file.exists()){
                    file.delete();
                }
            }
        }
        //从服务器删除存储的文件
        if(files != null && !files.equals("")){
            List<String> ids = new ArrayList<>();
            Collections.addAll(ids,files.split(","));
            List<ZFile> zFiles = fileService.getFiles(ids);
            for (ZFile zFile : zFiles) {
                File file = new File(zFile.getPath());
                if (file.exists()){
                    file.delete();
                }
            }
            fileService.deleteFiles(zFiles);
        }
        return eventMapper.deleteEvent(id);
    }

}
