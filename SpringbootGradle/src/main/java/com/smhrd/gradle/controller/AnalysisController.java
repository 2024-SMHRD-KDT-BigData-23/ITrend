package com.smhrd.gradle.controller;

import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.smhrd.gradle.mapper.AnalysisMapper;

@RestController
@RequestMapping("/api")
public class AnalysisController {

	@Autowired
	private AnalysisMapper analysismapper;
	
	@PostMapping("/job_recommend")
	public ResponseEntity<?> getJobRecommendations(@RequestBody Map<String, Object> requestBody) {
	    List<String> categories = (List<String>) requestBody.get("categories");

	    // Convert categories list to comma-separated string without brackets
	    String categoriesString = String.join(", ", categories).replaceAll("[\\[\\]]", "");

	    // Print received information
	    System.out.println("리액트에서 받아온 정보 : " + categoriesString);

	    // Prepare the request body
	    Map<String, String> requestBodyModified = new HashMap<>();
	    requestBodyModified.put("categories", categoriesString);
	    System.out.println("Flask로 보낼 정보 :  " + requestBodyModified);

	    // Send the modified request to Flask server
	    String flaskUrl = "http://localhost:5000/recommend";
	    RestTemplate restTemplate = new RestTemplate();
	    ResponseEntity<Map> response = restTemplate.postForEntity(flaskUrl, requestBodyModified, Map.class);

	    return ResponseEntity.ok(response.getBody());
	}
	
	@PostMapping("/sdwordCloud")
    public ResponseEntity<String> getsdWordcloud() {
        // DB에서 skills 리스트 가져오기
        List<String> skillsList = analysismapper.SDload();

        // Flask 서버 URL 설정
        String flaskUrl = "http://localhost:5000/sdwordcloud";

        // RestTemplate 인스턴스 생성
        RestTemplate restTemplate = new RestTemplate();

        // skillsList를 JSON 형식으로 변환
        Map<String, List<String>> requestBody = new HashMap<>();
        requestBody.put("text_list", skillsList);

        // Flask 서버로 POST 요청 보내기
        ResponseEntity<byte[]> response = restTemplate.postForEntity(flaskUrl, requestBody, byte[].class);

        // Flask 서버에서 받은 이미지를 Base64 인코딩
        byte[] imageBytes = response.getBody();
        String encodedImage = Base64.getEncoder().encodeToString(imageBytes);

        // Base64 인코딩된 이미지를 반환
        return ResponseEntity.ok(encodedImage);
    }

	
	@PostMapping("/jobwordCloud")
    public ResponseEntity<String> getjobWordcloud() {
        // DB에서 skills 리스트 가져오기
        List<String> jobList = analysismapper.jobload();

        // Flask 서버 URL 설정
        String flaskUrl = "http://localhost:5000/jobwordcloud";

        // RestTemplate 인스턴스 생성
        RestTemplate restTemplate = new RestTemplate();

        // skillsList를 JSON 형식으로 변환
        Map<String, List<String>> requestBody = new HashMap<>();
        requestBody.put("text_list", jobList);

        // Flask 서버로 POST 요청 보내기
        ResponseEntity<byte[]> response = restTemplate.postForEntity(flaskUrl, requestBody, byte[].class);

        // Flask 서버에서 받은 이미지를 Base64 인코딩
        byte[] imageBytes = response.getBody();
        String encodedImage = Base64.getEncoder().encodeToString(imageBytes);

        // Base64 인코딩된 이미지를 반환
        return ResponseEntity.ok(encodedImage);
    }
	
	@PostMapping("/jobwordCloudfq")
    public ResponseEntity<?> getjobWordcloudfq() {
        // DB에서 skills 리스트 가져오기
        List<String> jobList = analysismapper.jobload();

        // Flask 서버 URL 설정
        String flaskUrl = "http://localhost:5000/jobwordcloudfq";

        // RestTemplate 인스턴스 생성
        RestTemplate restTemplate = new RestTemplate();

        // skillsList를 JSON 형식으로 변환
        Map<String, List<String>> requestBody = new HashMap<>();
        requestBody.put("text_list", jobList);

        // Flask 서버로 POST 요청 보내기
        ResponseEntity<Map> response = restTemplate.postForEntity(flaskUrl, requestBody, Map.class);

	    return ResponseEntity.ok(response.getBody());

    }
	
	
	@PostMapping("/sdwordCloudfq")
    public ResponseEntity<?> getsdWordcloudfq() {
        // DB에서 skills 리스트 가져오기
        List<String> SDList = analysismapper.SDload();

        // Flask 서버 URL 설정
        String flaskUrl = "http://localhost:5000/sdwordcloudfq";

        // RestTemplate 인스턴스 생성
        RestTemplate restTemplate = new RestTemplate();

        // skillsList를 JSON 형식으로 변환
        Map<String, List<String>> requestBody = new HashMap<>();
        requestBody.put("text_list", SDList);

        // Flask 서버로 POST 요청 보내기
        ResponseEntity<Map> response = restTemplate.postForEntity(flaskUrl, requestBody, Map.class);
	    return ResponseEntity.ok(response.getBody());

    }
		 
	}
