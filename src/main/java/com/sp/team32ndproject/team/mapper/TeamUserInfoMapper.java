package com.sp.team32ndproject.team.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.sp.team32ndproject.team.vo.TeamInfoVO;
import com.sp.team32ndproject.team.vo.TeamUserInfoVO;

@Mapper
public interface TeamUserInfoMapper {
	int insertTeamUserInfo(TeamUserInfoVO teamUser);
	List<TeamUserInfoVO> selectTeamUserInfosWithHelper(TeamUserInfoVO teamUserInfoVO);
	int deleteTeamUserInfo(int tuNum);
	List<TeamUserInfoVO> selectTeamUsersByTaNum(int taNum);
}
