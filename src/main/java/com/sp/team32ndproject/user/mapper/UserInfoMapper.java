package com.sp.team32ndproject.user.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.sp.team32ndproject.user.vo.UserInfoVO;

@Mapper
public interface UserInfoMapper {
	UserInfoVO selectUserInfoByUiId(String uiId);

	int insertUserInfo(UserInfoVO user);

	UserInfoVO selectUserInfoByUiNum(@AuthenticationPrincipal UserInfoVO user);

	UserInfoVO selectPasswordByUiPwd(String uiId);

	int updateUserProfile(UserInfoVO user);

	int deleteUser(UserInfoVO user);
}