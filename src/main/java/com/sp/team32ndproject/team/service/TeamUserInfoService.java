package com.sp.team32ndproject.team.service;

import org.springframework.stereotype.Service;

import com.sp.team32ndproject.team.mapper.TeamUserInfoMapper;
import com.sp.team32ndproject.team.vo.TeamInfoVO;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamUserInfoService {
	private final TeamUserInfoMapper teamUserInfoMapper;
	
	public int insertTeamUserInfo(TeamInfoVO teamUser, UserInfoVO user) { 
		//return teamUserInfoMapper.insertTeamUserInfo(teamUser);
		return 0;
	}
}
