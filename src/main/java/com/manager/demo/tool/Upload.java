package com.manager.demo.tool;

import com.manager.demo.pojo.Music;
import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.mp3.MP3AudioHeader;
import org.jaudiotagger.audio.mp3.MP3File;
import org.jaudiotagger.tag.flac.FlacTag;
import org.jaudiotagger.tag.id3.AbstractID3v2Frame;
import org.jaudiotagger.tag.id3.AbstractID3v2Tag;
import org.jaudiotagger.tag.id3.ID3v23Frame;
import org.jaudiotagger.tag.id3.framebody.FrameBodyAPIC;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.UUID;

public class Upload {



    //上传文件
    public static HashMap uploadFile(MultipartFile file){
        String name = file.getOriginalFilename();
        // 图片路径格式=public/年月日/uuid
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
        String yyyyMMdd = sdf.format(new Date());
        String uuid = UUID.randomUUID().toString().replace("-", "").toLowerCase();
        String path = "public/file/"+yyyyMMdd+"/";
        String fileName = uuid+"."+name.split("\\.")[name.split("\\.").length-1];
        long size = file.getSize();
        File newFile = new File(path+fileName);
        // 如果路径不存在则先创建目录
        if(!newFile.getParentFile().exists()){
            newFile.getParentFile().mkdirs();
        }
        try(
                FileOutputStream outputStream = new FileOutputStream(newFile);
                ){
            outputStream.write(file.getBytes());
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            HashMap res = new HashMap();
            res.put("path",path+fileName);
            res.put("size",size);
            res.put("name",name);
            return res;
        }
    }

    //上传图片
    public static HashMap uploadPic(MultipartFile file){
        String name = file.getOriginalFilename();
        // 图片路径格式=public/年月日/uuid
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
        String yyyyMMdd = sdf.format(new Date());
        String uuid = UUID.randomUUID().toString().replace("-", "").toLowerCase();
        String path = "public/image/"+yyyyMMdd+"/";
        String fileName = uuid+"."+name.split("\\.")[name.split("\\.").length-1];
        File newFile = new File(path+fileName);
        // 如果路径不存在则先创建目录
        if(!newFile.getParentFile().exists()){
            newFile.getParentFile().mkdirs();
        }
        try(
                FileOutputStream outputStream = new FileOutputStream(newFile);
                ){
            outputStream.write(file.getBytes());
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            HashMap res = new HashMap();
            res.put("path",path);
            res.put("fileName",fileName);
            return res;
        }
    }


    // 上传图片(需与zui的uploader组件配合使用)
    public static HashMap zuiUpload(MultipartFile file, Integer chunk, Integer chunks, String name, HttpSession session) {
//        文件被分为多份分开上传
//        如果是第一份文件，将文件信息写入session，后续将使用这些信息进行文件合并完成上传
        if(chunk == 0){
//        图片路径格式=public/年月日/uuid
            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
            String yyyyMMdd = sdf.format(new Date());
            String uuid = UUID.randomUUID().toString().replace("-", "").toLowerCase();
            String filePath = "public/image/"+yyyyMMdd+"/"+uuid+"."+name.split("\\.")[name.split("\\.").length-1];
            session.setAttribute("filePath",filePath);
        }
        File photo = new File((String)session.getAttribute("filePath"));
//        如果路径不存在则先创建目录
        if(!photo.getParentFile().exists()){
            photo.getParentFile().mkdirs();
        }
        try (
                FileOutputStream outputStream = new FileOutputStream(photo,true);
        ){
//            开始上传文件
            outputStream.write(file.getBytes());
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            HashMap res = new HashMap();
//            如果是最后一份文件则结束上传，将文件保存路径返回
            if(chunk == chunks-1){
                String path = ((String)session.getAttribute("filePath")).substring(0,22);
                String fileName = ((String) session.getAttribute("filePath")).substring(22);
                res.put("path",path);
                res.put("fileName",fileName);
                session.removeAttribute("filePath");
            }
            return res;
        }
    }


    /**
     * /上传音乐文件
     * @param file 文件
     * @return
     */
    public static Music saveMusic(MultipartFile file){
        Music music = new Music();
        // 图片路径格式=public/年月日/uuid
        String name = file.getOriginalFilename();
        String fileType = name.split("\\.")[name.split("\\.").length-1];
        if(!fileType.equalsIgnoreCase("mp3") && !fileType.equalsIgnoreCase("flac")){
            return null;
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
        String yyyyMMdd = sdf.format(new Date());
        String uuid = UUID.randomUUID().toString().replace("-", "").toLowerCase();
        String path = "public/audio/"+yyyyMMdd+"/";
        String fileName = uuid+"."+fileType;
        String imagePath = "public/image/"+yyyyMMdd+"/"+uuid+".jpg";
        //音乐文件路径
        File temp = new File(path+fileName);
        //封面图片路径
        File imgFile = new File(imagePath);
        //如果路径不存在则先创建目录
        if(!temp.getParentFile().exists()){
            temp.getParentFile().mkdirs();
        }
        if(!imgFile.getParentFile().exists()){
            imgFile.getParentFile().mkdirs();
        }
        try(
            FileOutputStream outputStream = new FileOutputStream(temp);
            FileOutputStream imgOutputStream = new FileOutputStream(imgFile);
        ){
            //写入文件
            outputStream.write(file.getBytes());

            //写入后读取音乐信息
            if(fileType.equalsIgnoreCase("mp3")){
                //读取文件类型为MP3
                //获取封面图片
                MP3File mp3File = (MP3File) AudioFileIO.read(new File(path+fileName));
                AbstractID3v2Tag tag = mp3File.getID3v2Tag();
                AbstractID3v2Frame frame = (AbstractID3v2Frame) tag.getFrame("APIC");
                FrameBodyAPIC body = (FrameBodyAPIC) frame.getBody();
                byte[] imageData = body.getImageData();
                imgOutputStream.write(imageData);
                music.setCoverPath(imagePath);
                //获取头
                MP3AudioHeader audioHeader = (MP3AudioHeader) mp3File.getAudioHeader();
                //歌名
                ID3v23Frame songnameFrame = (ID3v23Frame) mp3File.getID3v2Tag().frameMap.get("TIT2");
                String songName = songnameFrame.getContent();
                music.setName(songName);
                //歌手
                ID3v23Frame artistFrame = (ID3v23Frame) mp3File.getID3v2Tag().frameMap.get("TPE1");
                String artist = artistFrame.getContent();
                music.setArtist(artist);
                //专辑
                ID3v23Frame albumFrame = (ID3v23Frame) mp3File.getID3v2Tag().frameMap.get("TALB");
                String album = albumFrame.getContent();
                music.setAlbum(album);
                //时长
                int duration = audioHeader.getTrackLength();
                String time = duration/60+":"+duration%60;
                music.setTime(time);
            }else if(fileType.equalsIgnoreCase("flac")){
                //读取类型为flac
                AudioFile audioFile = AudioFileIO.read(new File(path+fileName));
                FlacTag flacTag = (FlacTag) audioFile.getTag();
                String songName = flacTag.getFirst("TITLE");
                music.setName(songName);
                String artist = flacTag.getFirst("ARTIST");
                music.setArtist(artist);
                String album = flacTag.getFirst("ALBUM");
                music.setAlbum(album);
                byte[] imageData = flacTag.getFirstArtwork().getBinaryData();
                imgOutputStream.write(imageData);
                music.setCoverPath(imagePath);
                int duration = audioFile.getAudioHeader().getTrackLength();
                String time = duration/60+":"+duration%60;
                music.setTime(time);
            }else{
                return null;
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        music.setFileName(fileName);
        music.setPath(path);
        music.setSheet(-1);
        return music;
    }
}
