package com.sp.team32ndproject.user.controller;

import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.sp.team32ndproject.team.vo.MsgVO;
import com.sp.team32ndproject.user.service.UserInfoService;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@AllArgsConstructor
@Slf4j
public class UserInfoController {

	private final UserInfoService userInfoService;
	
	//폼태그 post 회원가입
	@PostMapping("/join")
	public int insertUserInfo(@RequestBody UserInfoVO user) {
		log.info("user => {}", user);
		return userInfoService.insertUserInfo(user); 
	}
	
	//회원가입시 입력한 아이디가 중복되는지 확인
	@GetMapping("/auth/user-infos/{uiId}")
	public MsgVO doCheckUiId(@PathVariable String uiId) {
		return userInfoService.doCheckUiId(uiId);
	}
	
	//uiNum으로 유저 정보 가져오기
	@GetMapping("/user-info")
	public UserInfoVO selectUserInfoByUiNum(@AuthenticationPrincipal UserInfoVO user) {
		log.info("user=>{}", user);
		return userInfoService.selectUserInfoByUiNum(user);
	}
	
	//회원정보 수정시 비밀번호 확인
	@PostMapping("/check-password")
	public boolean checkPassword(@AuthenticationPrincipal UserInfoVO user, @RequestBody Map<String, String> password) {
		return userInfoService.checkPassword(user.getUiId(), password);
	}
	
	//유저 프로필 업데이트 컨트롤러
	@PatchMapping("/update-profile")
    public int updateUserProfile(@AuthenticationPrincipal UserInfoVO user, @RequestBody Map<String, String>request) {
         return  userInfoService.updateUserProfile(user.getUiNum(), request);
    }
	//계정 삭제
	@PatchMapping("/user-info-delete")
    public MsgVO deleteUser(@AuthenticationPrincipal UserInfoVO user) {
         return  userInfoService.deleteUser(user);
       
    }
	

}
