package com.sp.team32ndproject.team.service;

import javax.naming.spi.DirStateFactory.Result;

import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.sp.team32ndproject.team.mapper.TeamInfoMapper;
import com.sp.team32ndproject.team.mapper.TeamSignUserInfoMapper;
import com.sp.team32ndproject.team.mapper.TeamUserInfoMapper;
import com.sp.team32ndproject.team.vo.MsgVO;
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
	private final TeamInfoMapper teamInfoMapper;
	private final TeamUserInfoService teamUserInfoService;
	
	public MsgVO insertTeamSignUserInfo(TeamInfoVO teamInfoVO, UserInfoVO user) {
		MsgVO msgVO = new MsgVO();
		if (teamUserInfoService.checkTeamUserInfo(teamInfoVO.getTaNum(), user.getUiNum())) {
			msgVO.setResultMsg("이미 가입된 팀 입니다.");
			return msgVO;
		}else if(teamInfoMapper.selectTeamInfoByTaNum(teamInfoVO.getTaNum()).getTaStatus().equals("0")) {
			msgVO.setResultMsg("팀을 구하고 있지 않은 상태입니다.");
			return msgVO;
		}else if(teamSignUserInfoMapper.selectTeamSignUserInfoByUiNumAndTaNum(user.getUiNum(), teamInfoVO.getTaNum()) != null) {
			msgVO.setResultMsg("이미 가입신청 상태 입니다.");
			return msgVO;
		}else {
			TeamSignUserInfoVO teamSignUserInfoVO = new TeamSignUserInfoVO();
			teamSignUserInfoVO.setTaNum(teamInfoVO.getTaNum());
			teamSignUserInfoVO.setUiNum(user.getUiNum());
			teamSignUserInfoVO.setTsuStatus("0");
			int result = teamSignUserInfoMapper.insertTeamSignUserInfo(teamSignUserInfoVO);
			if(result == 1) {
				msgVO.setResultMsg("가입신청 완료!");
				return msgVO;
			}else {
				msgVO.setResultMsg("가입신청 실패 다시 시도해 주세요");
				return msgVO;
			}
		}
	}
	//teamapply.js
	public PageInfo<TeamSignUserInfoVO> selectTeamSignUserInfosWithHelper(TeamSignUserInfoVO teamSignUserInfoVO){
		PageHelper.startPage(teamSignUserInfoVO.getPage(),teamSignUserInfoVO.getPageSize());
		return new PageInfo<>(teamSignUserInfoMapper.selectTeamSignUserInfosWithHelper(teamSignUserInfoVO));
	}
	//team-apply.js
	public int deleteTeamSignUserInfo(TeamSignUserInfoVO teamSignUserInfoVO) {
		return teamSignUserInfoMapper.deleteTeamSignUserInfo(teamSignUserInfoVO);
	}
}
