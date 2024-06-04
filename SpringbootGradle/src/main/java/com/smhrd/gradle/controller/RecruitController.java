package com.smhrd.gradle.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.gradle.mapper.NewsMapper;
import com.smhrd.gradle.mapper.RecruitMapper;
import com.smhrd.gradle.vo.NewsData;
import com.smhrd.gradle.vo.Recruit;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api")
public class RecruitController {
	
	@Autowired
	private RecruitMapper recruitMapper;
	
	@PostMapping("/getRecruitData")
	public ResponseEntity<List<Recruit>> getRecruitData(@RequestBody Map<String, String> request) {
	    String keyword = request.get("keyword");
	    List<Recruit> recruitDataList = recruitMapper.getRecruitData(keyword);
	    return ResponseEntity.ok(recruitDataList != null ? recruitDataList : new ArrayList<>());
	}

	
	
	 
}