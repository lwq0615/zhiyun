package com.manager.demo.controller;


import com.manager.demo.pojo.Album;
import com.manager.demo.pojo.Photo;
import com.manager.demo.pojo.Sheet;
import com.manager.demo.service.AlbumService;
import com.manager.demo.service.SheetService;
import com.manager.demo.tool.Upload;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileInputStream;
import java.util.*;

@RestController
public class AlbumController {

    @Autowired
    private AlbumService albumService;

    //相册
    @GetMapping("/album.html")
    public ModelAndView album(){
        return new ModelAndView("album");
    }


    /**
     * 上传照片(小程序用)
     * @param file 上传的文件
     * @param type 上传的目标相册（该字段不为空则为上传相册图片）
     * @param request 请求体
     * @return
     */
    @PostMapping("/uploadPic")
    public String uploadPic(MultipartFile file, Integer type, HttpServletRequest request){
        //图片上传服务器
        HashMap map = Upload.uploadPic(file);
        String userId = (String) request.getAttribute("userId");
        String path = (String) map.get("path");
        String fileName = (String) map.get("fileName");
        Photo photo = new Photo();
        photo.setUserId(userId);
        photo.setFileName(fileName);
        photo.setPath(path);
        photo.setType(type);
        if(type != null){
            //上传照片到相册写入信息到数据库.savePhoto(photo);
            albumService.savePhoto(photo);
        }
        return path+fileName;
    }



    /**
     * 获取所有相册名称和相册最后一张照片和各个相册照片总数
     * 用于展示各个相册的封面和相册照片数
     * @param request
     * @return: [
     *              {
     *                  type: 相册名,
     *                  count: 相册照片总数,
     *                  path: 相册最后的一张照片（作为相册封面）
     *              },
     *              {
     *                  ...
     *              }
     *          ]
     */
    @GetMapping("/getTypeAndPic")
    public List<HashMap> getTypes(HttpServletRequest request){
        String userId = (String) request.getAttribute("userId");
        return albumService.getTypes(userId);
    }

    /**
     * 分页查询照片
     * @param page 页码（不可为空）
     * @param size 每页条数（不可为空）
     * @param type 查询的相册（如果type=*则为查询全部）
     * @param request
     * @return: {
     *     photos:[照片对象1,照片2,....],
     *     count:当前查询相册的照片总数
     * }
     */
    @GetMapping("/getPhotos")
    public Map getPhotos(Integer page,Integer size,Integer type, HttpServletRequest request){
        String userId = (String) request.getAttribute("userId");
        Photo photo = new Photo();
        photo.setUserId(userId);
        photo.setType(type);
        //获取照片
        HashMap result = albumService.getPhotos(photo,(page-1)*size,size);
        Map res = new HashMap();
        res.put("photos",result.get("data"));
        res.put("count",result.get("count"));
        return res;
    }


    /**
     * 根据图片路径获取图片
     * @param response
     * @param url 图片路径
     * @param comp 是否压缩
     */
    @GetMapping("/getPicByUrl")
    public void getPicByUrl(HttpServletResponse response,String url,Boolean comp) {
        File file = new File(url);
        //开启下载
        //response.setHeader("Content-Disposition","attachment;filename="+file.getName());
        try{
            if(comp != null && comp){
                //压缩图片大小 用于各种缩略图
                if(file.exists()){
                    Thumbnails.of(file).scale(0.3).outputQuality(0.3).toOutputStream(response.getOutputStream());
                }
                return;
            }
            //将图片原画输出
            if(file.exists()){
                FileInputStream inputStream = new FileInputStream(file);
                byte[] bytes = new byte[8192];
                int len;
                while((len = inputStream.read(bytes)) != -1){
                    response.getOutputStream().write(bytes,0,len);
                }
                inputStream.close();
            }
        }catch (Exception e){}
    }

    /**
     * 上传图片(PC端使用zui上传组件)（分段上传）
     * @param file 上传的图片
     * @param chunk 第几段文件
     * @param chunks 文件总段数
     * @param name 图片原文件名
     * @param type 上传的目标相册
     */
    @PostMapping("/savePhoto")
    public void savePhoto(MultipartFile file,Integer chunk,Integer chunks,String name,HttpSession session,Integer type,HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        HashMap res = Upload.zuiUpload(file,chunk,chunks,name,session);
        if(!res.isEmpty()){
            String path = (String)res.get("path");
            String fileName = (String)res.get("fileName");
            Photo photo = new Photo();
            photo.setUserId(userId);
            photo.setType(type);
            photo.setPath(path);
            photo.setFileName(fileName);
            albumService.savePhoto(photo);
        }
    }


    /**
     * 新建相册
     * @param newTypeNm 新的相册名
     * @return 返回一个字符串，"修改成功"或者"相册名称重复"
     */
    @GetMapping("/createType")
    public String changeType(String newTypeNm,HttpServletRequest request){
        String userId = (String) request.getAttribute("userId");
        Album album = new Album();
        album.setUserId(userId);
        album.setName(newTypeNm);
        return albumService.saveAlbum(album);
    }

    /**
     * 批量删除相册
     * @param types 要删除的相册名数组
     */
    @PostMapping("/deleteTypes")
    public String deleteTypes(@RequestBody Integer[] types){
        albumService.deleteAlbums(types);
        return "删除成功";
    }

    /**
     * 批量删除图片
     * @param data 图片在数据库中的文件名数组
     */
    @PostMapping("/deletePhotos")
    public String deletePhotos(@RequestBody String[] data){
        albumService.deletePhotosByName(data);
        return "删除成功";
    }

    /**
     * 批量移动图片
     * @param data 图片在数据库中的文件名数组
     * @param type 要移动的目标相册
     * @return
     */
    @PostMapping("/movePhotos")
    public String movePhotos(@RequestBody String[] data,Integer type){
        albumService.movePhotosByName(data,type);
        return "照片移动成功";
    }

    /**
     * 获取用户相册列表
     * @param request
     * @return ['相册名1','相册名2',~~~~]
     */
    @GetMapping("/getTypesOfUser")
    public List<Album> getTypesOfUser(HttpServletRequest request){
        String userId = (String) request.getAttribute("userId");
        return albumService.getTypesOfUser(userId);
    }

    /**
     * 修改相册名
     * @param album 相册
     * @param request
     * @return
     */
    @PostMapping("/album/updateAlbum")
    public String updateAlbum(@RequestBody Album album,HttpServletRequest request){
        String userId = (String)request.getAttribute("userId");
        album.setUserId(userId);
        return albumService.saveAlbum(album);
    }

}
