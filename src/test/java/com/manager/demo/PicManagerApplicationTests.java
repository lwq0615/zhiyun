package com.manager.demo;

import com.manager.demo.mapper.UserMapper;
import com.manager.demo.pojo.User;
import com.manager.demo.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.lang.reflect.Array;
import java.util.Scanner;

@SpringBootTest
class PicManagerApplicationTests {

    @Autowired
    private UserMapper userMapper;

    @Test
    void contextLoads() {

    }

}
