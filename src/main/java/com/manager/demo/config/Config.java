package com.manager.demo.config;


import com.manager.demo.interceptor.LoginInterceptor;
import com.manager.demo.interceptor.PowerInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;

@Configuration
public class Config implements WebMvcConfigurer {

    /**
     * 注册自定义拦截器
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // **可以匹配多个/，*只能匹配一个/
        //必须以/开头

        //跳过静态资源的拦截
        ArrayList<String> staticURI = new ArrayList<>();
        staticURI.add("/*.html");
        staticURI.add("/**/*.js");
        staticURI.add("/**/*.css");
        staticURI.add("/**/*.ico");
        staticURI.add("/**/*.eot");
        staticURI.add("/**/*.svg");
        staticURI.add("/**/*.ttf");
        staticURI.add("/**/*.woff");
        staticURI.add("/**/*.jpg");
        staticURI.add("/**/*.png");
        //不需要任何权限的接口
        ArrayList<String> passURI = new ArrayList<>();
        staticURI.add("/");
        staticURI.add("/error");
        staticURI.add("/login");
        staticURI.add("/register");
        staticURI.add("/getPicByUrl");
        staticURI.add("/getMusic");
        staticURI.add("/getFileByUrl");
        //只需要判断登录不需要判断权限的接口
        ArrayList<String> onlyLoginURI = new ArrayList<>();
        staticURI.add("/pagePower");


        //拦截未登录的用户
        registry.addInterceptor(new LoginInterceptor())
            .addPathPatterns("/**")
            .excludePathPatterns(staticURI)
            .excludePathPatterns(passURI);
        //拦截没有权限的用户
        registry.addInterceptor(new PowerInterceptor())
            .addPathPatterns("/**")
            .excludePathPatterns(staticURI)
            .excludePathPatterns(passURI)
            .excludePathPatterns(onlyLoginURI);
    }

}
