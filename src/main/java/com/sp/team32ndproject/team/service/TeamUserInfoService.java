package com.sp.team32ndproject.team.service;

import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.sp.team32ndproject.team.mapper.TeamSignUserInfoMapper;
import com.sp.team32ndproject.team.mapper.TeamUserInfoMapper;
import com.sp.team32ndproject.team.vo.TeamInfoVO;
import com.sp.team32ndproject.team.vo.TeamSignUserInfoVO;
import com.sp.team32ndproject.team.vo.TeamUserInfoVO;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamUserInfoService {
	
	private final TeamUserInfoMapper teamUserInfoMapper;
	private final TeamSignUserInfoMapper teamSignUserInfoMapper;
	
	
	//팀 만들때 
	public int insertTeamUserInfo(TeamUserInfoVO teamUserInfoVO) {  
		return teamUserInfoMapper.insertTeamUserInfo(teamUserInfoVO);
	}
	
	public int insertTeamUserInfoToUser(TeamSignUserInfoVO teamSignUserInfoVO) {
		TeamUserInfoVO teamUserInfoVO = new TeamUserInfoVO();
		teamUserInfoVO.setUiNum(teamSignUserInfoVO.getUiNum());
		teamUserInfoVO.setTaNum(teamSignUserInfoVO.getTaNum());
		teamUserInfoVO.setTuRole("USER");
		if(1 == teamUserInfoMapper.insertTeamUserInfo(teamUserInfoVO)) {
			return teamSignUserInfoMapper.deleteTeamSignUserInfo(teamSignUserInfoVO);
		}else {
			return 0;
		}
	
		
	}
	public TeamUserInfoVO selecTeamUserInfo(TeamUserInfoVO teamUserInfoVO) {  
		return teamUserInfoMapper.selectTeamUserInfo(teamUserInfoVO);
	}
	
	public PageInfo<TeamUserInfoVO> selectTeamUserInfosWithHelper(TeamUserInfoVO teamUserInfoVO){
		PageHelper.startPage(teamUserInfoVO.getPage(),teamUserInfoVO.getPageSize());
		return new PageInfo<>(teamUserInfoMapper.selectTeamUserInfosWithHelper(teamUserInfoVO));
	}
	
	public int deleteTeamUserInfo(TeamUserInfoVO teamUserInfoVO) {
		return teamUserInfoMapper.deleteTeamUserInfo(teamUserInfoVO);
	}
}
