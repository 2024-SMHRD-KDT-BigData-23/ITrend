package com.smhrd.gradle.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Member {
	// 사용자아이디 
    private String user_id;

    // 비밀번호 
    private String user_pw;

    // 이름 
    private String user_name;

    // 생년월일 
    private String user_birthdate;

    // 성별 
    private String user_gender;

    // 주소 
    private String user_loc;

    // 연락처 
    private String user_phone;

    

	    
}
