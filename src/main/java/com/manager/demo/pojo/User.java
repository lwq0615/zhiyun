package com.manager.demo.pojo;


import lombok.Data;

@Data
public class User {
    private Integer id;
    private String userId;
    private String password;
    private String userName;
    private String headImg;
    private Integer role;
}
