package com.manager.demo.pojo;


import lombok.Data;


@Data
public class Event {

    private Integer id;
    private String title;
    private String detail;
    private String date;
    private String time;
    private String imgs;
    private String files;
    private String userId;

}
