package com.manager.demo.interceptor;
import com.alibaba.fastjson.JSONObject;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Base64;
import java.util.Map;

public class LoginInterceptor implements HandlerInterceptor {


    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object o) throws Exception {
        //使用header验证
        String token = request.getHeader("token");
        if(token != null && !token.equals("")){
            //解析token
            try{
                String object = new String(Base64.getDecoder().decode(token.getBytes()));
                Map map = (Map) JSONObject.parse(object);
                String userId = (String) map.get("userId");
                int roleId = (int) map.get("role");
                Integer id = (Integer) map.get("id");
                long time = System.currentTimeMillis()/1000 -  Long.parseLong((String) map.get("time"));
                if(time > 24*60*60){
                    //token过期时间为一天
                    response.sendError(402);
                    return false;
                }
                if(userId != null && id != null){
                    //登录成功
                    request.setAttribute("userId",userId);
                    request.setAttribute("roleId",roleId);
                    request.setAttribute("id",id);
                    return true;
                }else{
                    response.sendError(401);
                    return false;
                }
            }catch (Exception e){
                e.printStackTrace();
                //有token但是token解析失败
                response.sendError(401);
                return false;
            }
        }else{
            //没有登录
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
