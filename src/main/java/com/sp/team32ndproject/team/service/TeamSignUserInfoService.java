package com.sp.team32ndproject.team.service;

import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.sp.team32ndproject.team.mapper.TeamSignUserInfoMapper;
import com.sp.team32ndproject.team.vo.TeamInfoVO;
import com.sp.team32ndproject.team.vo.TeamSignUserInfoVO;
import com.sp.team32ndproject.user.vo.UserInfoVO;


import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TeamSignUserInfoService {
	
	private final TeamSignUserInfoMapper teamSignUserInfoMapper;
	
	public int insertTeamSignUserInfo(TeamInfoVO teamInfoVO, UserInfoVO user) {
		if(teamSignUserInfoMapper.selectTeamSignUserInfoByUiNum(user.getUiNum()) != null) {
			return 0;
		}else {
			TeamSignUserInfoVO teamSignUserInfoVO = new TeamSignUserInfoVO();
			teamSignUserInfoVO.setTaNum(teamInfoVO.getTaNum());
			teamSignUserInfoVO.setUiNum(user.getUiNum());
			teamSignUserInfoVO.setTsuStatus("0");
			return teamSignUserInfoMapper.insertTeamSignUserInfo(teamSignUserInfoVO);
		}
	}
	
	public PageInfo<TeamSignUserInfoVO> selectTeamSignUserInfosWithHelper(TeamSignUserInfoVO teamSignUserInfoVO){
		PageHelper.startPage(teamSignUserInfoVO.getPage(),teamSignUserInfoVO.getPageSize());
		return new PageInfo<>(teamSignUserInfoMapper.selectTeamSignUserInfosWithHelper(teamSignUserInfoVO));
	}
}
