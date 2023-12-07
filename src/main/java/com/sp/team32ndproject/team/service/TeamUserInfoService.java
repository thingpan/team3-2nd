package com.sp.team32ndproject.team.service;

import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.sp.team32ndproject.team.mapper.TeamUserInfoMapper;
import com.sp.team32ndproject.team.vo.TeamInfoVO;
import com.sp.team32ndproject.team.vo.TeamUserInfoVO;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamUserInfoService {
	
	private final TeamUserInfoMapper teamUserInfoMapper;
	
	
	//팀 만들때 
	public int insertTeamUserInfo(TeamUserInfoVO teamUserInfoVO) {  
		return teamUserInfoMapper.insertTeamUserInfo(teamUserInfoVO);
	}
	
	//팀 가입신청
	public int insertTeamUserInfo(TeamInfoVO team, UserInfoVO user) {
		TeamUserInfoVO teamUser = new TeamUserInfoVO();
		teamUser.setTaNum(team.getTaNum());
		teamUser.setUiNum(user.getUiNum());
		teamUser.setTuRole("USER");
		return teamUserInfoMapper.insertTeamUserInfo(teamUser); 
		
	}
	
	public PageInfo<TeamUserInfoVO> selectTeamUserInfosWithHelper(TeamUserInfoVO teamUserInfoVO){
		PageHelper.startPage(teamUserInfoVO.getPage(),teamUserInfoVO.getPageSize());
		return new PageInfo<>(teamUserInfoMapper.selectTeamUserInfosWithHelper(teamUserInfoVO));
	}
}
