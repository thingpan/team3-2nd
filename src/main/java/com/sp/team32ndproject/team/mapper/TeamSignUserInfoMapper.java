package com.sp.team32ndproject.team.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.sp.team32ndproject.team.vo.TeamSignUserInfoVO;

@Mapper
public interface TeamSignUserInfoMapper {
	int insertTeamSignUserInfo(TeamSignUserInfoVO teamSignUserInfoVO);
}
