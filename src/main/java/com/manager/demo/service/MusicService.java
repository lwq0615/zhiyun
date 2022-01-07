package com.manager.demo.service;


import com.manager.demo.mapper.MusicMapper;
import com.manager.demo.mapper.SheetMapper;
import com.manager.demo.pojo.Music;
import com.manager.demo.tool.Pinyin;
import org.apache.tomcat.util.buf.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.*;

@Service
@Transactional
public class MusicService {


    @Autowired
    private MusicMapper musicMapper;


//    新增编辑
    public int saveMusic(Music music){
        if(music.getId() == null){
            //新增
            return musicMapper.saveMusic(music);
        }else{
            //修改
            List<String> set = new ArrayList<>();
            if(music.getSheet() != null){
                set.add("sheet = "+music.getSheet());
            }
            if(music.getFileName() != null){
                set.add("fileName = '"+music.getFileName()+"'");
            }
            if(music.getArtist() != null){
                set.add("artist = '"+music.getArtist()+"'");
            }
            if(music.getTime() != null){
                set.add("time = '"+music.getTime()+"'");
            }
            if(music.getName() != null){
                set.add("name = '"+music.getName()+"'");
            }
            if(music.getCoverPath() != null){
                set.add("coverPath = '"+music.getCoverPath()+"'");
            }
            if(music.getPath() != null){
                set.add("path = '"+music.getPath()+"'");
            }
            if(music.getAlbum() != null){
                set.add("album = '"+music.getAlbum()+"'");
            }
            if(music.getUserId() != null){
                set.add("userId = '"+music.getUserId()+"'");
            }
            String sql = StringUtils.join(set,',');
            return musicMapper.editMusic(sql,music.getId());
        }
    }

    //播放次数加一
    public int addCount(Integer id){
        return musicMapper.addCount(id);
    }

    //条件查询
   /*
   data:{
        search: 查询参数,
        page: 页码参数,
        like: 模糊查询参数
    }
    */
    public HashMap getMusicPage(HashMap data){
        List<Music> musics = new ArrayList<>();
        String where = "where 1 = 1 ";
        //分页查询页码参数
        HashMap pageInfo = (HashMap)data.get("page");
        String limit = "";
        if(pageInfo != null){
            int size = (int)pageInfo.get("size");
            int page = (int)pageInfo.get("page");
            limit += " limit " + size + " offset " + (page-1)*size;
        }
        //条件查询参数
        HashMap search = (HashMap)data.get("search");
        if(search != null){
            if(search.get("id") != null){
                where += " and id = "+search.get("id");
            }
            if(search.get("count") != null){
                String value = ((String)search.get("count")).replace("'","\\'");
                where += " and count = "+value;
            }
            if(search.get("name") != null){
                String value = ((String)search.get("name")).replace("'","\\'");
                where += " and name = '"+value+"'";
            }
            if(search.get("artist") != null){
                String value = ((String)search.get("artist")).replace("'","\\'");
                where += " and artist = '"+value+"'";
            }
            if(search.get("album") != null){
                String value = ((String)search.get("album")).replace("'","\\'");
                where += " and album = '"+value+"'";
            }
            if(search.get("time") != null){
                String value = ((String)search.get("time")).replace("'","\\'");
                where += " and time = '"+value+"'";
            }
            if(search.get("userId") != null){
                String value = ((String)search.get("userId")).replace("'","\\'");
                where += " and userId = '"+value+"'";
            }
            if(search.get("path") != null){
                String value = ((String)search.get("path")).replace("'","\\'");
                where += " and path = '"+value+"'";
            }
            if(search.get("fileName") != null){
                String value = ((String)search.get("fileName")).replace("'","\\'");
                where += " and fileName = '"+value+"'";
            }
            if(search.get("sheet") != null){
                where += " and sheet = "+search.get("sheet");
            }
            if(search.get("coverPath") != null){
                String value = ((String)search.get("coverPath")).replace("'","\\'");
                where += " and coverPath = '"+value+"'";
            }
        }
        //模糊查询
        HashMap like = (HashMap) data.get("like");
        if(like != null){
            String searchName = (String) like.get("searchName");
            String searchWay = (String) like.get("searchWay");
            if(searchName != null){
                if(searchWay == null || searchWay.equals("")){
                    //聚合搜索
                    String temp = " and (name like '%"+searchName+"%' or artist like '%"+searchName+"%' or album like '%"+searchName+"%')";
                    where += temp;
                }else{
                    where += " and " + searchWay +" like '%"+searchName+"%'";
                }
            }
        }
        musics = musicMapper.getList(where,limit);
        int count = musicMapper.getListCount(where);
        HashMap res = new HashMap();
        res.put("data",musics);
        res.put("count",count);
        return res;
    }


    //获取艺人列表并根据字典序排序
    public HashMap getArtists(String userId){
        //根据首字母进行分类
        List<String> artists = musicMapper.getArtists(userId);
        HashMap szmMap = new HashMap();
        for(String artist:artists){
            String szm = Pinyin.getPinYinHead(artist).substring(0,1);
            if(szmMap.get(szm) == null){
                szmMap.put(szm,new ArrayList<>());
            }
            List<String> szmList = (List<String>)szmMap.get(szm);
            szmList.add(artist);
        }
        //根据首字母进行字典序排序
        List<String> keys = new ArrayList<>(szmMap.keySet());
        for(String key:keys){
            List<String> szmList = (List<String>) szmMap.get(key);
            Collections.sort(szmList);
        }
        return szmMap;
    }

    //根据艺人获取专辑列表
    public List<String> getAlbumByArtist(String userId,String artist){
        return musicMapper.getAlbums(userId,artist);
    }

    //获取艺人专辑跟歌曲
    public HashMap getArtistAlbumMusic(String userId){
        //res:{artistMap,countMap}
        //artistMap  艺人>专辑》歌曲
        //countMap  艺人》专辑数量，歌曲数量
        HashMap res = new HashMap();
        List<String> artists = musicMapper.getArtists(userId);
        HashMap artistMap = new HashMap();
        HashMap countMap = new HashMap();
        for(String artist:artists){
            HashMap count = new HashMap();
            List<String> albums = musicMapper.getAlbums(userId,artist);
            count.put("albumCount",albums.size());
            int musicCount = 0;
            HashMap albumMap = new HashMap();
            for(String album:albums){
                String where = "where userId = '"+userId+"'"+" and artist = '"+artist+"'"+" and album = '"+album+"'"+" and sheet = -1";
                List<Music> musics = musicMapper.getList(where,"");
                albumMap.put(album,musics);
                musicCount += musics.size();
            }
            count.put("musicCount",musicCount);
            countMap.put(artist,count);
            artistMap.put(artist,albumMap);
        }
        res.put("count",countMap);
        res.put("data",artistMap);
        return res;
    }


    //添加音乐到歌单
    public void addMusicToSheet(List<Music> musics,Integer sheet,String userId){
        //先根据id进行排序
        for(int i=1;i<musics.size();i++){
            for(int j=0;j<musics.size()-i;j++){
                if(musics.get(j).getId() > musics.get(j+1).getId()){
                    Collections.swap(musics,j,j+1);
                }
            }
        }
        //添加信息到数据库
        for(Music music:musics){
            music.setSheet(sheet);
            music.setCount(0);
            music.setUserId(userId);
            List<Music> check = musicMapper.getList("where fileName = '"+music.getFileName()+"' and sheet = "+music.getSheet(),"");
            if(check != null && check.size() > 0){
                continue;
            }
            musicMapper.saveMusic(music);
        }
    }



    //删除音乐
    public void deleteMusics(List<Music> musics){
        for(Music music:musics){
            if(music.getSheet() == -1){
                File file = new File(music.getPath()+music.getFileName());
                File imgFile = new File(music.getCoverPath());
                if(file.exists()){
                    file.delete();
                }
                if(imgFile.exists()){
                    imgFile.delete();
                }
                List<Music> sameNameFile = musicMapper.findSameNameFile(music.getFileName());
                for(Music music1:sameNameFile){
                    musicMapper.deleteMusicById(music1.getId());
                }
            }
            musicMapper.deleteMusicById(music.getId());
        }
    }

}
