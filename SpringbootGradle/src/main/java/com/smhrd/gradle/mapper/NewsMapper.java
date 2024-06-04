package com.smhrd.gradle.mapper;

import com.smhrd.gradle.vo.NewsData;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface NewsMapper {
    
	List<NewsData> getNewsData();
}
