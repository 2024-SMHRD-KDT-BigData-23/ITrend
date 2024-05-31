package com.smhrd.gradle;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.smhrd.gradle.mapper")
public class SpringbootGradleApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringbootGradleApplication.class, args);
	}

}
