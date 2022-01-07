package com.manager.demo.controller;


import com.manager.demo.pojo.Music;
import com.manager.demo.pojo.Sheet;
import com.manager.demo.service.MusicService;
import com.manager.demo.service.SheetService;
import com.manager.demo.tool.Upload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.util.*;

@RestController
public class MusicController {

    @Autowired
    private MusicService musicService;
    @Autowired
    private SheetService sheetService;

    //音乐
    @GetMapping("/music.html")
    public ModelAndView music(){
        return new ModelAndView("music");
    }


    //获取音乐文件
    @GetMapping("/getMusic")
    public void getMusic(HttpServletResponse response, HttpServletRequest request,String path) throws Exception{
        File file = new File(path);
        int range = 0;
        if(request.getHeader("Range") != null){
            range = Integer.parseInt(request.getHeader("Range").split("=")[1].split("-")[0]);
        }
        if(file.exists()){
            FileInputStream inputStream = new FileInputStream(file);
            response.addHeader("Accept-Ranges", "bytes");
            response.addHeader("Content-Length", file.length() + "");
            response.addHeader("Content-Range", "bytes "+range+"-" + file.length() + "/" + file.length());
            response.addHeader("Content-Type", "audio/mpeg;charset=UTF-8");
            byte[] bytes = new byte[8192];
            int len;
            while((len = inputStream.read(bytes)) != -1){
                response.getOutputStream().write(bytes,0,len);
            }
            inputStream.close();
        }
    }


    /**
     * 修改歌单信息
     * @param sheet
     */
    @PostMapping("/album/saveSheet")
    public void saveSheet(@RequestBody Sheet sheet){
        //修改歌单封面图
        Sheet oldSheet = new Sheet();
        oldSheet.setId(sheet.getId());
        oldSheet = sheetService.getSheets(oldSheet).get(0);
        sheetService.saveSheet(sheet);
        //删除原来的封面图
        if(oldSheet.getCoverImg()!=null && sheet.getCoverImg()!=null && !oldSheet.getCoverImg().equals(sheet.getCoverImg())){
            File oldFile = new File(oldSheet.getCoverImg());
            if(oldFile.exists()){
                oldFile.delete();
            }
        }
    }

    //播放次数加一
    @GetMapping("/addCount")
    public void addCount(Integer id){
        musicService.addCount(id);
    }

    //上传音乐
    @PostMapping("/uploadMusic")
    public String uploadMusic(MultipartFile file, HttpServletRequest request){
        String userId = (String) request.getAttribute("userId");
        Music music = Upload.saveMusic(file);
        music.setUserId(userId);
        if(music != null){
            HashMap data = new HashMap();
            HashMap search = new HashMap();
            search.put("name",music.getName());
            search.put("artist",music.getArtist());
            search.put("album",music.getAlbum());
            search.put("time",music.getTime());
            data.put("search",search);
            HashMap res = musicService.getMusicPage(data);
            if(res.get("data") != null && ((List<Music>)res.get("data")).size() > 0){
                File musicFile = new File(music.getPath()+music.getFileName());
                File coverFile = new File(music.getCoverPath());
                if(musicFile.exists()){
                    musicFile.delete();
                }
                if(coverFile.exists()){
                    coverFile.delete();
                }
                return music.getName()+" 已存在";
            }
            musicService.saveMusic(music);
        }else{
            return "文件类型错误";
        }
        return "上传成功";
    }

    //根据歌单和搜索条件获取音乐列表
    @PostMapping("/getList")
    public HashMap getList(@RequestBody HashMap data,HttpServletRequest request){
        String userId = (String) request.getAttribute("userId");
        ((HashMap)data.get("search")).put("userId",userId);
        return musicService.getMusicPage(data);
    }

    //获取歌单列表
    @GetMapping("/getSheets")
    public List<Sheet> getSheets(HttpServletRequest request){
        String userId = (String) request.getAttribute("userId");
        Sheet search = new Sheet();
        search.setUserId(userId);
        return sheetService.getSheets(search);
    }

    //获取艺人列表并根据字典序排序
    @GetMapping("/getArtists")
    public HashMap getArtists(HttpServletRequest request){
        String userId = (String) request.getAttribute("userId");
        return musicService.getArtists(userId);
    }

    //根据艺人获取专辑列表
    @GetMapping("/getAlbumByArtist")
    public List<String> getAlbumByArtist(HttpServletRequest request,String artist){
        String userId = (String) request.getAttribute("userId");
        return musicService.getAlbumByArtist(userId,artist);
    }

    //获取艺人专辑跟歌曲
    @GetMapping("/getArtistAlbumMusic")
    public HashMap getArtistAlbumMusic(HttpServletRequest request){
        //res:{artistMap,countMap}
        //artistMap  艺人>专辑》歌曲
        //countMap  艺人》专辑数量，歌曲数量
        String userId = (String) request.getAttribute("userId");
        return musicService.getArtistAlbumMusic(userId);
    }


    //删除音乐
    @PostMapping("/deleteMusics")
    public void deleteMusics(@RequestBody List<Music> musics){
        musicService.deleteMusics(musics);
    }

    //新建歌单
    @GetMapping("/addSheet")
    public String addSheet(String name,HttpServletRequest request){
        String userId = (String) request.getAttribute("userId");
        Sheet sheet = new Sheet();
        sheet.setUserId(userId);
        sheet.setSheetName(name);
        if(sheetService.sheetToo(userId,name)){
            return "歌单名称重复";
        }else{
            sheetService.saveSheet(sheet);
            return "添加成功";
        }
    }

    //添加音乐到歌单
    @PostMapping("/addMusicToSheet")
    public void addMusicToSheet(@RequestBody List<Music> musics,Integer sheet,HttpServletRequest request){
        String userId = (String) request.getAttribute("userId");
        musicService.addMusicToSheet(musics,sheet,userId);
    }

    //删除歌单
    @DeleteMapping("/deleteSheet")
    public void deleteSheet(Integer sheet){
        sheetService.deleteSheet(sheet);
    }

    //获取用户所有歌单及其信息
    @GetMapping("/getSheetsInfo")
    public List<Sheet> getSheetsInfo(HttpServletRequest request){
        String userId = (String) request.getAttribute("userId");
        Sheet sheet = new Sheet();
        sheet.setUserId(userId);
        return sheetService.getSheets(sheet);
    }

    //修改歌单信息
    @GetMapping("/updateSheet")
    public String updateSheet(String newName,Integer oldId){
        if(newName == null || newName.equals("") || oldId == null){
            return "参数不完整";
        }
        Sheet search = new Sheet();
        search.setId(oldId);
        Sheet sheet = sheetService.getSheets(search).get(0);
        sheet.setSheetName(newName);
        sheetService.saveSheet(sheet);
        return "修改成功";
    }

    //获取歌曲列表的歌单信息
    @GetMapping("/getSheetOfAllMusic")
    public Sheet getSheetOfAllMusic(HttpServletRequest request){
        String userId = (String) request.getAttribute("userId");
        return sheetService.getSheetOfAllMusic(userId);
    }

    //查询单个歌单
    @GetMapping("/getSheet")
    public Sheet getSheet(HttpServletRequest request,Integer sheetId){
        String userId = (String)request.getAttribute("userId");
        Sheet sheet = new Sheet();
        sheet.setUserId(userId);
        sheet.setId(sheetId);
        return sheetService.getSheets(sheet).get(0);
    }

}
