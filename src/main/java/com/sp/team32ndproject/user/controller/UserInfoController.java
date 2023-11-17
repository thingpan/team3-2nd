package com.sp.team32ndproject.user.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sp.team32ndproject.user.service.UserInfoService;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@AllArgsConstructor
@Slf4j
public class UserInfoController {
	
	private final UserInfoService userInfoService;
	
	@PostMapping("/join")
	@ResponseBody
	public int insertUserInfo(@RequestBody UserInfoVO user) {
		log.info("user => {}", user);
		return userInfoService.insertUserInfo(user);
	}
	
}
