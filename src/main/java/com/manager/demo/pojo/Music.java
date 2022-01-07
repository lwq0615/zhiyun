package com.manager.demo.pojo;


import lombok.Data;

@Data
public class Music {
    private Integer id;
    private String name;
    private String artist;
    private String album;
    private String time;
    private int count;
    private String userId;
    private String path;
    private String fileName;
    private Integer sheet;
    private String coverPath;
}
