package com.smhrd.gradle.mapper;

import com.smhrd.gradle.vo.Recruit;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RecruitMapper {
    
	List<Recruit> getRecruitData(String keyword);
}
