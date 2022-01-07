package com.manager.demo.service;


import com.alibaba.fastjson.JSONObject;
import com.manager.demo.mapper.*;
import com.manager.demo.pojo.Power;
import com.manager.demo.pojo.User;
import org.apache.tomcat.util.buf.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private MusicMapper musicMapper;
    @Autowired
    private PhotoMapper photoMapper;
    @Autowired
    private PowerService powerService;


    //获取用户token信息
    public boolean pagePower(HttpServletRequest request,String url){
        Map map = new HashMap();
        try{
            String token = request.getHeader("token");
            String object = new String(Base64.getDecoder().decode(token.getBytes()));
            map = (Map) JSONObject.parse(object);
        }catch (Exception e){
            e.printStackTrace();
        }
        List<String> powers = (List<String>) map.get("power");
        return powers != null && powers.contains(url);
    }

    public String getUsertoken(User user){
        HashMap map = new HashMap();
        long time = System.currentTimeMillis()/1000;//以秒为单位
        map.put("time",String.valueOf(time));
        map.put("userId",user.getUserId());
        map.put("role",user.getRole());
        map.put("id",user.getId());
        //获取用户权限url
        List<Power> powers = powerService.getUserPower(user.getUserId());
        List<String> urls = new ArrayList<>();
        for(Power power:powers){
            urls.add(power.getUrl());
        }
        map.put("power",urls);
        JSONObject object = new JSONObject(map);
        return Base64.getEncoder().encodeToString(object.toString().getBytes());
    }


    //精确查询多个用户信息
    public List<User> getUsers(User user){
        String where = " where 1 = 1 ";
        if(user.getId() != null){
            where += " and id = "+user.getId();
        }
        if(user.getUserId() != null){
            where += " and userId = '"+user.getUserId()+"'";
        }
        if(user.getRole() != null){
            where += " and role = "+user.getUserId();
        }
        if(user.getPassword() != null){
            where += " and password = '"+user.getPassword()+"'";
        }
        if(user.getUserName() != null){
            where += " and userName = '"+user.getUserName()+"'";
        }
        return userMapper.selectUser(where);
    }
    //分页
    public HashMap getUsers(User user,int page,int size){
        HashMap res = new HashMap();
        String where = " where 1 = 1 ";
        if(user.getId() != null){
            where += " and id = "+user.getId();
        }
        if(user.getUserId() != null){
            where += " and userId = '"+user.getUserId()+"'";
        }
        if(user.getRole() != null){
            where += " and role = "+user.getUserId();
        }
        if(user.getPassword() != null){
            where += " and password = '"+user.getPassword()+"'";
        }
        if(user.getUserName() != null){
            where += " and userName = '"+user.getUserName()+"'";
        }
        int count = userMapper.getCount(where);
        where += " limit "+size+" offset "+(page-1)*size;
        List<User> data = userMapper.selectUser(where);
        res.put("count",count);
        res.put("data",data);
        return res;
    }

    //模糊查询用户信息
    public List<User> getLikeUser(User user){
        String where = " where 1 = 1 ";
        if(user.getUserId() != null){
            where += " and userId like '%"+user.getUserId()+"%'";
        }
        if(user.getRole() != null){
            where += " and role = "+user.getUserId();
        }
        if(user.getPassword() != null){
            where += " and password like '%"+user.getPassword()+"%'";
        }
        if(user.getUserName() != null){
            where += " and userName like '%"+user.getUserName()+"%'";
        }
        return userMapper.selectUser(where);
    }
    //分页
    public HashMap getLikeUser(User user,int page,int size){
        HashMap res = new HashMap();
        String where = " where 1 = 1 ";
        if(user.getUserId() != null){
            where += " and userId like '%"+user.getUserId()+"%'";
        }
        if(user.getRole() != null){
            where += " and role = "+user.getRole();
        }
        if(user.getPassword() != null){
            where += " and password like '%"+user.getPassword()+"%'";
        }
        if(user.getUserName() != null){
            where += " and userName like '%"+user.getUserName()+"%'";
        }
        int count = userMapper.getCount(where);
        where += " limit "+size+" offset "+(page-1)*size;
        List<User> data = userMapper.selectUser(where);
        res.put("count",count);
        res.put("data",data);
        return res;
    }


    //删除用户
    //ids:用户id,逗号分割
    public int deleteUsers(String ids){
        return userMapper.deleteUsers(ids);
    }

    //修改获增加用户
    public String saveUser(User user){
        if(user.getId() == null){
            //新增
            userMapper.addUser(user);
            return "新增成功";
        }else{
            //修改
            List<String> set = new ArrayList<>();
            if(user.getRole() != null){
                set.add("role = "+user.getRole());
            }
            if(user.getUserName() != null){
                set.add("userName = '"+user.getUserName()+"'");
            }
            if(user.getUserId() != null){
                set.add("userId = '"+user.getUserId()+"'");
            }
            if(user.getPassword() != null){
                set.add("password = '"+user.getPassword()+"'");
            }
            if(user.getHeadImg() != null){
                set.add("headImg = '"+user.getHeadImg()+"'");
            }
            String sql = StringUtils.join(set,',');
            userMapper.editUser(sql,user.getId());
            return "编辑成功";
        }
    }

    //获取用户的基本信息
    //包括用户上传的照片音乐数
    //参数：用户ID
    public HashMap getUserInfo(String userId){
        //查询用户上传的照片和音乐数量
        int musicCount = musicMapper.getSheetOfAllMusicCount(userId);
        int photoCount = photoMapper.getCount("where userId = '"+userId+"'");
        //查询user表的user信息
        String where = " where userId = '"+userId+"'";
        HashMap res = JSONObject.parseObject(JSONObject.toJSONString(userMapper.selectUser(where).get(0)),HashMap.class);
        res.put("musicCount",musicCount);
        res.put("photoCount",photoCount);
        return res;
    }

}
