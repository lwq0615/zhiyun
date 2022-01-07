package com.manager.demo.service;


import com.manager.demo.mapper.AlbumMapper;
import com.manager.demo.mapper.PhotoMapper;
import com.manager.demo.pojo.Album;
import com.manager.demo.pojo.Photo;
import org.apache.tomcat.util.buf.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@Transactional
public class AlbumService {

    @Autowired
    private PhotoMapper photoMapper;
    @Autowired
    private AlbumMapper albumMapper;



    //修改获新增photo信息
    public String savePhoto(Photo photo){
        if(photo.getId() == null){
            //新增
            photoMapper.savePhoto(photo);
            return "新增成功";
        }else{
            //修改
            List<String> set = new ArrayList<>();
            if(photo.getFileName() != null){
                set.add("fileName = '"+photo.getFileName()+"'");
            }
            if(photo.getPath() != null){
                set.add("path = '"+photo.getPath()+"'");
            }
            if(photo.getType() != null){
                set.add("type = '"+photo.getType()+"'");
            }
            String sql = StringUtils.join(set,',');
            photoMapper.editPhoto(sql,photo.getId());
            return "编辑成功";
        }
    }

    //获取所有相册名称和相册最后一张照片和各个相册照片总数
    public List<HashMap> getTypes(String userId){
        List<Album> albums = new ArrayList<>();
        Album all = new Album();
        all.setName("全部");
        albums.add(all);
        String selectWhere = " where userId = '"+userId+"'";
        albums.addAll(albumMapper.getAlbums(selectWhere));
        //得到用户所有相册列表
        List<HashMap> res = new ArrayList<>();
        for(Album item:albums){
            String type = item.getName();
            //获取每个相册的封面图和照片总数
            HashMap album = new HashMap();
            album.put("name",type);
            album.put("id",item.getId());
            String where = "where 1 = 1";
            if(item.getId() != null){
                where += " and type = "+item.getId();
            }
            int count = photoMapper.getCount(where);
            album.put("count",count);
            List<Photo> photo = photoMapper.getPhotos(where,1,0);
            if(photo.size() != 0){
                album.put("path",photo.get(0).getPath()+photo.get(0).getFileName());
            }
            res.add(album);
        }
        return res;
    }

    //分页查询照片
    public HashMap getPhotos(Photo photo,int page,int size){
        HashMap res = new HashMap();
        String where = " where 1 = 1 ";
        if(photo.getId() != null){
            where += " and id = '"+photo.getId()+"'";
        }
        if(photo.getUserId() != null){
            where += " and userId = '"+photo.getUserId()+"'";
        }
        if(photo.getType() != null){
            where += " and type = "+photo.getType();
        }
        if(photo.getPath() != null){
            where += " and path = '"+photo.getPath()+"'";
        }
        if(photo.getFileName() != null){
            where += " and fileName = '"+photo.getFileName()+"'";
        }
        int count = photoMapper.getCount(where);
        List<Photo> data = photoMapper.getPhotos(where,size,page);
        res.put("count",count);
        res.put("data",data);
        return res;
    }

    //批量删除相册
    public int deleteAlbums(Integer[] types){
        List<String> typesStr = new ArrayList<>();
        for(int i=0;i<types.length;i++){
            typesStr.add("'"+types[i]+"'");
        }
        String albumIds = StringUtils.join(typesStr,',');
        //删除服务器上的图片数据
        List<Photo> photos = photoMapper.getPhotosByTypes(albumIds);
        for (Photo photo : photos) {
            File file = new File(photo.getPath()+photo.getFileName());
            if(file.exists()){
                file.delete();
            }
        }
        //删除数据库对应数据
        photoMapper.deletePhotosByTypes(albumIds);
        //删除相册
        return albumMapper.deleteAlbums(albumIds);
    }

    //根据图片名批量删除图片
    public int deletePhotosByName(String[] names){
        for(int i=0;i<names.length;i++){
            File file = new File(names[i]);
            if(file.exists()){
                file.delete();
            }
            names[i] = "'"+names[i].split("/")[names[i].split("/").length-1]+"'";
        }
        String photos = StringUtils.join(names);
        return photoMapper.deletePhotosByNames(photos);
    }

    //根据图片名批量移动图片
    public int movePhotosByName(String[] names,Integer type){
        for(int i=0;i<names.length;i++){
            names[i] = "'"+names[i]+"'";
        }
        String fileNames = StringUtils.join(names);
        return photoMapper.movePhotos(type,fileNames);
    }

    //获取用户相册列表
    public List<Album> getTypesOfUser(String userId){
        return albumMapper.getAlbums(" where userId= '"+userId+"'");
    }

    //修改相册名
    public String saveAlbum(Album album){
        if(album.getId() == null){
            //新增
            albumMapper.addAlbum(album);
            return "新增成功";
        }else{
            //修改
            String set = "set ";
            if(album.getName() != null){
                set += " name = '"+album.getName()+"'";
            }
            if(album.getUserId() != null){
                set += " userId = '"+album.getUserId()+"'";
            }
            albumMapper.updateAlbum(album.getId(),set);
            return "修改成功";
        }
    }


}
