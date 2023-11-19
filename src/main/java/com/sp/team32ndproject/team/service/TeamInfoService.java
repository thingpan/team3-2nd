package com.sp.team32ndproject.team.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sp.team32ndproject.team.mapper.TeamInfoMapper;
import com.sp.team32ndproject.team.vo.TeamInfoVO;
import com.sp.team32ndproject.user.mapper.UserInfoMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class TeamInfoService {

	private final TeamInfoMapper teamInfoMapper;

	public int insertTeamInfo(TeamInfoVO team) {
		return teamInfoMapper.insertTeamInfo(team);
	}

	public List<TeamInfoVO>selectTeamInfos(TeamInfoVO team) {
		return teamInfoMapper.selectTeamInfos(team);
	}
}
