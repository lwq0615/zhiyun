package com.manager.demo.pojo;

import lombok.Data;

@Data
public class Photo {
    private Integer id;
    private Integer type;
    private String userId;
    private String path;
    private String fileName;


}
