package com.manager.demo.service;


import com.manager.demo.mapper.MusicMapper;
import com.manager.demo.mapper.SheetMapper;
import com.manager.demo.pojo.Music;
import com.manager.demo.pojo.Sheet;
import org.apache.tomcat.util.buf.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class SheetService {

    @Autowired
    private SheetMapper sheetMapper;
    @Autowired
    private MusicMapper musicMapper;


    //新增修改
    public String saveSheet(Sheet sheet){
        if(sheet.getId() == null){
            //新增
            sheetMapper.addSheet(sheet);
            return "新增成功";
        }else{
            //修改
            List<String> set = new ArrayList<>();
            if(sheet.getCoverImg() != null){
                set.add("coverImg = '"+sheet.getCoverImg()+"'");
            }
            if(sheet.getSheetName() != null){
                set.add("sheetName = '"+sheet.getSheetName()+"'");
            }
            if(sheet.getUserId() != null){
                set.add("userId = '"+sheet.getUserId()+"'");
            }
            String sql = StringUtils.join(set,',');
            sheetMapper.editSheet(sql,sheet.getId());
            return "编辑成功";
        }
    }

    //判断是否重复歌单
    public boolean sheetToo(String userId,String sheetName){
        List<Sheet> sheets = sheetMapper.getSheets("where userId = '"+userId+"' and sheetName = '"+sheetName+"'");
        return sheets.size() > 0;
    }

    //删除歌单
    public void deleteSheet(Integer sheetId){
        Sheet sheet = sheetMapper.getSheets("where id = "+sheetId).get(0);
        if(sheet.getCoverImg() != null && !sheet.getCoverImg().equals("")){
            File file = new File(sheet.getCoverImg());
            if(file.exists()){
                file.delete();
            }
        }
        musicMapper.deleteMusicsBySheet(sheetId);
        sheetMapper.deleteSheet(sheetId);
    }

    //查询歌单
    public List<Sheet> getSheets(Sheet sheet){
        String where = " where 1 = 1 ";
        if(sheet.getUserId() != null){
            where += " and userId = '"+sheet.getUserId()+"'";
        }
        if(sheet.getSheetName() != null){
            where += " and sheetName = '"+sheet.getSheetName()+"'";
        }
        if(sheet.getCoverImg() != null){
            where += " and coverImg = '"+sheet.getCoverImg()+"'";
        }
        if(sheet.getId() != null){
            where += " and id = "+sheet.getId();
        }
        return sheetMapper.getSheets(where);
    }


    //获取歌曲列表的歌单信息
    public Sheet getSheetOfAllMusic(String userId){
        Sheet sheet = new Sheet();
        sheet.setUserId(userId);
        sheet.setSheetName("");
        sheet.setCoverImg(musicMapper.getCoverPath(userId));
        sheet.setId(-1);
        return sheet;
    }


}
