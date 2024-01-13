package com.sp.team32ndproject.common.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{
	
	@Value("${download.file-path}")
	private String filePath; 
	@Value("${download.resource-url}")
	private String resourceUrl;

	@Value("${cloud.aws.s3.bucket}")
	private String bucket;
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/upload/**")
		.addResourceLocations("https://3nd-team3.s3.ap-northeast-2.amazonaws.com/");
	}	
	
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration corsConfigurationSource = new CorsConfiguration();
		corsConfigurationSource.setAllowCredentials(true);
		corsConfigurationSource.setAllowedOrigins(List.of("*"));
		corsConfigurationSource.setAllowedHeaders(List.of("*"));
		corsConfigurationSource.setAllowedMethods(List.of("POST", "PATCH", "PUT", "GET", "POST", "DELETE"));
		UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
		urlBasedCorsConfigurationSource.registerCorsConfiguration("/react/**", corsConfigurationSource);
		return urlBasedCorsConfigurationSource;
	}
}
