package com.sp.team32ndproject.user.service;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sp.team32ndproject.user.controller.UserInfoController;
import com.sp.team32ndproject.user.mapper.UserInfoMapper;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserInfoService implements UserDetailsService {

	private final UserInfoMapper userInfoMapper;
	private final PasswordEncoder passwordEncoder;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		UserInfoVO user = userInfoMapper.selectUserInfoByUiId(username);
		if (user == null) {
			throw new UsernameNotFoundException("아이디나 비밀번호가 잘못 되었습니다.");
		}
		return user;
	}

	public int insertUserInfo(UserInfoVO user) {
		user.setUiPwd(passwordEncoder.encode(user.getPassword()));
		return userInfoMapper.insertUserInfo(user);
	}

	public UserInfoVO doCheckUiId(String uiId) {
		return userInfoMapper.selectUserInfoByUiId(uiId);
	}

	public UserInfoVO selectUserInfoByUiId(String uiId) {
		return userInfoMapper.selectUserInfoByUiId(uiId);
	}

	public UserInfoVO selectUserInfoByUiNum(@AuthenticationPrincipal UserInfoVO user) {
		// TODO Auto-generated method stub
		return userInfoMapper.selectUserInfoByUiNum(user);
	}

	
	public boolean checkPassword(String uiId, Map<String, String> password) {
		UserInfoVO user = userInfoMapper.selectPasswordByUiPwd(uiId);
		if(passwordEncoder.matches(password.get("password"), user.getUiPwd())) {
			return true;
		}
		return false;
	}

	public int updateUserProfile(String uiId, Map<String, String> request) {
	    UserInfoVO user = userInfoMapper.selectUserInfoByUiId(uiId); 
	    if (request.containsKey("uiName")) {
	    	user.setUiName(request.get("uiName"));
	    }
	    if (request.containsKey("uiAddress")) {
	        user.setUiAddress(request.get("uiAddress"));
	    }
	    if (request.containsKey("uiBirth")) {
	        user.setUiBirth(request.get("uiBirth"));
	    }
	    if (request.containsKey("uiPhoneNum")) {
	        user.setUiPhoneNum(request.get("uiPhoneNum"));
	    }
	    if (request.containsKey("uiEmail")) {
	        user.setUiEmail(request.get("uiEmail"));
	    }if(request.containsKey("uiPwd")) {
	    user.setUiPwd(request.get(passwordEncoder.encode("uiPwd")));
	    }
	    return userInfoMapper.updateUserProfile(user);
	}

}
