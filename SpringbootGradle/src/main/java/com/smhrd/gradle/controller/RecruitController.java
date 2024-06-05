package com.smhrd.gradle.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
	
	@PostMapping("/RDkeywordFind")
	public ResponseEntity<List<Recruit>> RDkeywordFind(@RequestBody Map<String, String> request) {
	    String keyword = request.get("keyword");
	    List<Recruit> recruitDataList = recruitMapper.RDkeywordFind(keyword);
	    return ResponseEntity.ok(recruitDataList != null ? recruitDataList : new ArrayList<>());
	}
	
	@PostMapping("RDload")
	public ResponseEntity<List<Recruit>> RDload(){
		List<Recruit> recruitDataList = recruitMapper.RDload();
		return ResponseEntity.ok(recruitDataList != null ? recruitDataList : new ArrayList<>());
	}
	
	

	@PostMapping("/updateLatLng")
    public ResponseEntity<String> updateCoords(@RequestBody List<Map<String, Object>> places) {
        for (Map<String, Object> place : places) {
            String address = (String) place.get("address");
            String latitude = (String) place.get("latitude");
            String longitude = (String) place.get("longitude");

            // 데이터베이스에 업데이트하는 로직을 여기에 추가하세요.
            // 예를 들어:
            int result = recruitMapper.updateLatLng(address, latitude, longitude);
            if (result <= 0) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update coordinates for address: " + address);
            }
        }

        return ResponseEntity.ok("성공입니다 형님");
    }
	
	@PostMapping("/RDcategoryFind")
	public ResponseEntity<List<Recruit>> RDcategoryFind(@RequestBody List<String> checkedSkill){
		List<Recruit> recruitDataList = new ArrayList<>();
		for (String category : checkedSkill) {
			List<Recruit> recruit = recruitMapper.RDcategoryFind(category);
			recruitDataList.addAll(recruit);
		}
		return ResponseEntity.ok(recruitDataList != null ? recruitDataList : new ArrayList<>());
		
	}
	    
	    
	}


