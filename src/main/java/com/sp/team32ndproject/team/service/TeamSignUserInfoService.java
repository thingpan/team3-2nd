package com.sp.team32ndproject.team.service;

import org.springframework.stereotype.Service;

import com.sp.team32ndproject.team.mapper.TeamSignUserInfoMapper;
import com.sp.team32ndproject.team.vo.TeamInfoVO;
import com.sp.team32ndproject.team.vo.TeamSignUserInfoVO;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamSignUserInfoService {
	
	private final TeamSignUserInfoMapper teamSignUserInfoMapper;
	
	public int insertTeamSignUserInfo(TeamInfoVO teamInfoVO, UserInfoVO user) {
		TeamSignUserInfoVO teamSignUserInfoVO = new TeamSignUserInfoVO();
		teamSignUserInfoVO.setTaNum(teamInfoVO.getTaNum());
		teamSignUserInfoVO.setUiNum(user.getUiNum());
		teamSignUserInfoVO.setTsuStatus("0");
		return teamSignUserInfoMapper.insertTeamSignUserInfo(teamSignUserInfoVO);
	}
}
