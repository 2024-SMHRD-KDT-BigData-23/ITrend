package com.smhrd.gradle.mapper;

import com.smhrd.gradle.vo.Member;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberMapper {
    
    List<Member> findByUseridandpw(String user_id, String user_pw);
    
    int signupMember(Member member);
    
}
