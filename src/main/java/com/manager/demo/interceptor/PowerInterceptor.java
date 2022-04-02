package com.manager.demo.interceptor;

import com.alibaba.fastjson.JSONObject;
import com.manager.demo.tool.Jwt;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Base64;
import java.util.List;
import java.util.Map;

public class PowerInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object o) throws Exception {
        //使用header验证
        String token = request.getHeader("token");
        String url = request.getRequestURI();
        //解析token
        try{

            Map map = Jwt.parse(token);
            List<String> powers = (List<String>) map.get("power");
            if(powers != null && powers.contains(url)){
                return true;
            }else{
                //登录成功但是该用户角色没有权限
                response.sendError(403);
                return false;
            }
        }catch (Exception e){
            e.printStackTrace();
            //有token但是token解析失败
            response.sendError(401);
            return false;
        }
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }

}
