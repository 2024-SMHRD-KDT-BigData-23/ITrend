package com.smhrd.gradle.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.gradle.mapper.NewsMapper;
import com.smhrd.gradle.vo.NewsData;

import java.util.List;


@RestController
@RequestMapping("/api")
public class NewsController {
	
	@Autowired
	private NewsMapper newsMapper;
	
	@PostMapping("/newspage_process")
	   public ResponseEntity<List<NewsData>> getNewspage() {
	       List<NewsData> newsDataList = newsMapper.getNewsData();
	       if (newsDataList != null) {
	           return ResponseEntity.ok(newsDataList);
	       } else {
	           return ResponseEntity.status(401).body(null);
	       }
	   }
	
	
	 
}