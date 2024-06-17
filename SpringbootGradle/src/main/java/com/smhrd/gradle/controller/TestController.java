package com.smhrd.gradle.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.gradle.mapper.MemberMapper;
import com.smhrd.gradle.vo.Member;

import java.util.Arrays;
import java.util.List;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class TestController {
	
	@Autowired
	private MemberMapper memberMapper;
	
	@GetMapping("/hello")
    public ResponseEntity<List<String>> getData() {
        List<String> data = Arrays.asList("Data1", "Data2", "Data3","이게 보이면 성공한거야","dasdsads");
        return ResponseEntity.ok(data);
    }
	
	@GetMapping("/login")
    public String login() {
        return "login";  // This should return the name of your login HTML or JSP page
    }
	
//	@PostMapping("/login_process")
//    public ResponseEntity<String> getLoginData(@RequestBody Member member) {
//        boolean isAuthenticated = memberService.authenticate(member.getUser_id(), member.getUser_pw());
//        if (isAuthenticated) {
//            // JWT 토큰 발급 혹은 성공 메시지 반환
//            return ResponseEntity.ok("Login successful");
//        } else {
//            return ResponseEntity.status(401).body("Invalid credentials");
//        }
//    }
	
	@PostMapping("/login_process")
	public ResponseEntity<List<Member>> getLoginData(@RequestBody Member member) {
	    List<Member> result = memberMapper.findByUseridandpw(member.getUser_id(), member.getUser_pw());
	    if (result != null) {
	    	System.out.println("리절트안에 뭐들었다냐???" + result);
	        return ResponseEntity.ok(result);
	    } else {
	        return ResponseEntity.status(401).body(null);
	    }
	}

 
	@GetMapping("/signup")
    public String signup() {
        return "signup";  // This should return the name of your signup HTML or JSP page
    }
 
	@PostMapping("/signup_process")
    public ResponseEntity<String> signupMember(@RequestBody Member member) {
        int result = memberMapper.signupMember(member);
        if (result > 0) {
        	return ResponseEntity.ok("success");
        } else {
        	return ResponseEntity.ok("fail");
        }
    }
	
	
	@GetMapping("/dashboard")
    public String dashBoard() {
        return "dashboard";  // This should return the name of your signup HTML or JSP page
    }
	
	
	@PostMapping("/dashboard_process")
    public ResponseEntity<String> getDashboard(HttpSession session) {
        String userId = (String) session.getAttribute("user_id");
        if (userId != null) {	
            return ResponseEntity.ok(userId);
        } else {
            return ResponseEntity.status(401).body("Unauthorized");
        }
    }
	
	
	
	
	 
}