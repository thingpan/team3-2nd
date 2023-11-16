package com.sp.team32ndproject.user.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sp.team32ndproject.user.mapper.UserInfoMapper;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserInfoService implements UserDetailsService{
	
	private final UserInfoMapper userInfoMapper;
	private final PasswordEncoder passwordEncoder;
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		UserInfoVO user = userInfoMapper.selectUserInfoByUiId(username);
		if(user == null) {
			throw new UsernameNotFoundException("아이디나 비밀번호가 잘못 되었습니다.");
		}
		return user;
	}

}
