package com.sp.team32ndproject.team.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.sp.team32ndproject.team.mapper.TeamInfoMapper;
import com.sp.team32ndproject.team.mapper.TeamSignUserInfoMapper;
import com.sp.team32ndproject.team.mapper.TeamUserInfoMapper;
import com.sp.team32ndproject.team.vo.MsgVO;
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
	private final TeamInfoMapper teamInfoMapper;

	// 팀 만들때
	public int insertTeamUserInfo(TeamUserInfoVO teamUserInfoVO) {
		return teamUserInfoMapper.insertTeamUserInfo(teamUserInfoVO);
	}

	public int insertTeamUserInfoToUser(TeamSignUserInfoVO teamSignUserInfoVO) {
		TeamUserInfoVO teamUserInfoVO = new TeamUserInfoVO();
		teamUserInfoVO.setUiNum(teamSignUserInfoVO.getUiNum());
		teamUserInfoVO.setTaNum(teamSignUserInfoVO.getTaNum());
		teamUserInfoVO.setTuRole("USER");
		if (1 == teamUserInfoMapper.insertTeamUserInfo(teamUserInfoVO)) {
			return teamSignUserInfoMapper.deleteTeamSignUserInfo(teamSignUserInfoVO);
		} else {
			return 0;
		}

	}

	public PageInfo<TeamUserInfoVO> selectTeamUserInfosWithHelper(TeamUserInfoVO teamUserInfoVO) {
		PageHelper.startPage(teamUserInfoVO.getPage(), teamUserInfoVO.getPageSize());
		return new PageInfo<>(teamUserInfoMapper.selectTeamUserInfosWithHelper(teamUserInfoVO));
	}

	public MsgVO deleteTeamUserInfo(int tuNum, int taNum, int uiNum) {
		MsgVO msgVO = new MsgVO();
		if (teamInfoMapper.selectAdminByUiNumAndTaNum(uiNum, taNum) != null) {
			int result = teamUserInfoMapper.deleteTeamUserInfo(tuNum);
			if (result == 1) {
				msgVO.setResultMsg("방출 성공!");
				return msgVO;
			} else {
				msgVO.setResultMsg("방출 실패 다시 시도해 주세요!");
				return msgVO;
			}

		} else {
			msgVO.setResultMsg("팀장만 방출 가능합니다!");
			return msgVO;
		}

	}

	public boolean checkTeamUserInfo(int taNum, int uiNum) {
		List<TeamUserInfoVO> teamUserInfoVOList = teamUserInfoMapper.selectTeamUsersByTaNum(taNum);
		for (TeamUserInfoVO teamUserInfoVO : teamUserInfoVOList) {
			if (teamUserInfoVO.getUiNum() == uiNum) {
				return true;
			}
		}
		return false;
	}

}
