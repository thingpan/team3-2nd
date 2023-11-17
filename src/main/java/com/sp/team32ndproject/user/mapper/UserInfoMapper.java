package com.sp.team32ndproject.user.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.sp.team32ndproject.user.vo.UserInfoVO;

@Mapper
public interface UserInfoMapper {
	UserInfoVO selectUserInfoByUiId(String uiId); 
	int insertUserInfo(UserInfoVO user);
}
