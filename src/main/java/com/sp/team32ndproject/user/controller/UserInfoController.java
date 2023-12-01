package com.sp.team32ndproject.user.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.sp.team32ndproject.user.service.UserInfoService;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@AllArgsConstructor
@Slf4j
public class UserInfoController {
	
	private final UserInfoService userInfoService;
	
	@PostMapping("/join")
	public int insertUserInfo(@RequestBody UserInfoVO user) {
		log.info("user => {}", user);
		return userInfoService.insertUserInfo(user);
	}
	
	@PostMapping("/check-id")
	public UserInfoVO loadUserByUsername(@RequestBody UserInfoVO user){
		return userInfoService.doCheckUiId(user.getUiId());
	}

	
}
