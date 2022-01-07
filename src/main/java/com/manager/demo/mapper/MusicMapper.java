package com.manager.demo.mapper;


import com.manager.demo.pojo.Music;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MusicMapper {

    //上传音乐
    @Insert("insert into music (name,artist,album,time,count,userId,path,fileName,sheet,coverPath) " +
            "values (#{name},#{artist},#{album},#{time},${count},#{userId},#{path},#{fileName},${sheet},#{coverPath})")
    int saveMusic(Music music);

    //获取音乐列表
    @Select("select * from music ${where} order by id desc ${limit}")
    List<Music> getList(String where,String limit);

    //列表记录条数
    @Select("select count(*) from music ${where}")
    int getListCount(String where);

    //播放次数加一
    @Update("update music set count = count + 1 where id = ${id}")
    int addCount(int id);

    //获取艺人列表
    @Select("select DISTINCT artist from music where userId = #{userId}")
    List<String> getArtists(String userId);

    //获取专辑列表
    @Select("select DISTINCT album from music where userId = #{userId} and artist = #{artist}")
    List<String> getAlbums(String userId,String artist);

    //根据id删除歌曲
    @Delete("delete from music where id = (${ids})")
    int deleteMusicById(int id);

    //根据歌单删除歌曲
    @Delete("delete from music where sheet = ${sheet}")
    int deleteMusicsBySheet(Integer sheet);

    //查找相同文件名的音乐文件
    @Select("select * from music where fileName = #{fileName}")
    List<Music> findSameNameFile(String fileName);

    //修改音乐的歌单字段（修改歌单名称时使用）
    @Update("update music set ${set} where id = ${id}")
    int editMusic(String set,Integer id);

    //查询歌曲歌单的count
    @Select("select count(*) FROM music WHERE userId = #{userId} and sheet = -1")
    int getSheetOfAllMusicCount(String userId);

    //查询歌曲歌单的最后一首歌曲封面图
    @Select("select coverPath FROM music WHERE userId = #{userId} and sheet = -1 ORDER BY id desc LIMIT 1")
    String getCoverPath(String userId);
}
