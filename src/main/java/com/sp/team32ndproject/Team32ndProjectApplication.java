package com.sp.team32ndproject;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan
public class Team32ndProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(Team32ndProjectApplication.class, args);
	}

}
