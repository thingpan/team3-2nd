package com.sp.team32ndproject.team.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.sp.team32ndproject.team.vo.TeamUserInfoVO;

@Mapper
public interface TeamUserInfoMapper {
	int insertUserInfo(TeamUserInfoVO teamUser);
}
