package com.sp.team32ndproject.user.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.sp.team32ndproject.user.vo.UserInfoVO;

@Mapper
public interface UserInfoMapper {
	
	UserInfoVO selectUserInfoByUiId(String uiId); //join.html //mypage.html
	
	int insertUserInfo(UserInfoVO user);

	int updateUserInfos(UserInfoVO user); // mypage.html

	UserInfoVO selectUserInfoByUiNum(@AuthenticationPrincipal UserInfoVO user); //mypage.html
	
	List<UserInfoVO> selectUserInfos(UserInfoVO userInfoVO);
	List<UserInfoVO> selectUserInfosforChat(int uiNum );
}