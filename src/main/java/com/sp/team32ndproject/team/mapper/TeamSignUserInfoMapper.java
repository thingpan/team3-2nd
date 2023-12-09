package com.sp.team32ndproject.team.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.sp.team32ndproject.team.vo.TeamSignUserInfoVO;

@Mapper
public interface TeamSignUserInfoMapper {
	int insertTeamSignUserInfo(TeamSignUserInfoVO teamSignUserInfoVO);
	List<TeamSignUserInfoVO> selectTeamSignUserInfosWithHelper(TeamSignUserInfoVO teamSignUserInfoVO);
	TeamSignUserInfoVO selectTeamSignUserInfoByUiNum(int uiNum);
	int deleteTeamSignUserInfo(TeamSignUserInfoVO teamSignUserInfoVO);
	
}
