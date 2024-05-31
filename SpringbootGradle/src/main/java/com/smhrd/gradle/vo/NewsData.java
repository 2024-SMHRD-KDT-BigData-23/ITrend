package com.smhrd.gradle.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewsData {

	private String news_title;
	
	private String news_content;
	
	private String news_created_at;
	
	private String news_img;
	
	private String news_category;
	
	private String news_tag;
}
