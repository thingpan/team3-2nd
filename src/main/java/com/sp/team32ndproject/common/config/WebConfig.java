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
	
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler(resourceUrl)
		.addResourceLocations(filePath);
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
