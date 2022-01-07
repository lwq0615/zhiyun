package com.manager.demo.mapper;


import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.HashMap;
import java.util.List;

@Mapper
public interface DictMapper {


    @Select("select value,label from dict where type = '工具'")
    List<HashMap> getToolDict();

}
