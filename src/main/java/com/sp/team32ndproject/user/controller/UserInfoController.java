package com.sp.team32ndproject.user.controller;

import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
	public UserInfoVO loadUserByUsername(@RequestBody UserInfoVO user) {
		return userInfoService.doCheckUiId(user.getUiId());
	}

	@GetMapping("/user-info")
	public UserInfoVO selectUserInfoByUiNum(@AuthenticationPrincipal UserInfoVO user) {
		log.info("user=>{}", user);
		return userInfoService.selectUserInfoByUiNum(user);
	}

	@PutMapping("/change-password")
	public int changePassword(@AuthenticationPrincipal UserInfoVO user, @RequestBody String newPassword) {
		log.info("Changing password for user: {}", user.getUiId());

		return userInfoService.changePassword(user.getUiId(), newPassword);
	}

	@PostMapping("/check-password")
	public boolean checkPassword(@AuthenticationPrincipal UserInfoVO user, @RequestBody Map<String,String> password ) {
		return userInfoService.checkPassword(user.getUiId(), password);
	}

}
