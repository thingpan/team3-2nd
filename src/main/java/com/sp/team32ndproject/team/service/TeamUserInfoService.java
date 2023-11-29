package com.sp.team32ndproject.team.service;

import org.springframework.stereotype.Service;

import com.sp.team32ndproject.team.mapper.TeamUserInfoMapper;
import com.sp.team32ndproject.team.vo.TeamUserInfoVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamUserInfoService {
	private final TeamUserInfoMapper teamUserInfoMapper;
	
	int insertUserInfo(TeamUserInfoVO teamUser) {
		return teamUserInfoMapper.insertUserInfo(teamUser);
	}
}
