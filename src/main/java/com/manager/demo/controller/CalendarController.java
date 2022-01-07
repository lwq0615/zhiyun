package com.manager.demo.controller;

import com.alibaba.fastjson.JSONObject;
import com.manager.demo.pojo.Event;
import com.manager.demo.pojo.ZFile;
import com.manager.demo.service.CalendarService;
import com.manager.demo.service.FileService;
import com.manager.demo.tool.Upload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class CalendarController {


    @Autowired
    private FileService fileService;
    @Autowired
    private CalendarService calendarService;


    /**
     * 保存日历工具模块的事件
     * @param data 事件对象
     */
    @PostMapping("/tools/rili/saveEvent")
    public int saveEvent(@RequestBody Event data, HttpServletRequest request){
        String userId = (String)request.getAttribute("userId");
        data.setUserId(userId);
        return calendarService.saveEvent(data);
    }

    //获取日历事件
    @GetMapping("/tools/rili/getEvents")
    public List<Event> getEvents(HttpServletRequest request){
        String userId = (String)request.getAttribute("userId");
        Event event = new Event();
        event.setUserId(userId);
        return calendarService.getEvents(event);
    }


    //删除日历事件
    @GetMapping("/tools/rili/deleteEvent")
    public int deleteEvent(int id){
        return calendarService.deleteEvent(id);
    }


    //上传日历事件的图片
    @PostMapping("/tools/rili/uploadEventImgs")
    public List<String> uploadEventImgs(MultipartFile[] files){
        // Upload.uploadPic方法上传图片
        List<String> res = new ArrayList<>();
        for (MultipartFile file : files) {
            HashMap path = Upload.uploadPic(file);
            res.add((String) path.get("path")+path.get("fileName"));
        }
        //返回上传后图片在服务器的存储地址
        return res;
    }


    //上传日历事件的文件
    @PostMapping("/tools/rili/uploadEventFiles")
    public List<Map> uploadEventFiles(MultipartFile[] files){
        // Upload.uploadFile方法上传图片
        List<Map> res = new ArrayList<>();
        for (MultipartFile file : files) {
            HashMap result = Upload.uploadFile(file);
            //文件写入数据库
            ZFile zFile = JSONObject.parseObject(JSONObject.toJSONString(result),ZFile.class);
            Integer id = fileService.saveFile(zFile);
            result.put("id",id);
            res.add(result);
        }
        //返回上传后图片在服务器的存储地址
        return res;
    }


    //根据id查询文件信息
    @PostMapping("/tools/getFiles")
    public List<ZFile> getFiles(@RequestBody List<String> ids){
        return fileService.getFiles(ids);
    }

    //根据路径下载文件
    @GetMapping("/getFileByUrl")
    public void getFileByUrl(String path, HttpServletResponse response){
        File file = new File(path);
        if(file.exists()){
            try(
                    FileInputStream inputStream = new FileInputStream(file);
            ){
                byte[] bytes = new byte[inputStream.available()];
                inputStream.read(bytes);
                response.getOutputStream().write(bytes);
            }catch (Exception e){}
        }
    }

}
