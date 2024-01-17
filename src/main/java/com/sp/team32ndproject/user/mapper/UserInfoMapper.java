package com.sp.team32ndproject.user.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.sp.team32ndproject.user.vo.UserInfoVO;

@Mapper
public interface UserInfoMapper {
	//join.html
	UserInfoVO selectUserInfoByUiId(String uiId);
	//join.html
	int insertUserInfo(UserInfoVO user);

	int updateUserInfos(UserInfoVO user);

	UserInfoVO selectUserInfoByUiNum(@AuthenticationPrincipal UserInfoVO user);
}