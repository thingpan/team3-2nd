package com.sp.team32ndproject.team.service;

import java.util.Iterator;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.sp.team32ndproject.match.mapper.MatchBoardInfoMapper;
import com.sp.team32ndproject.match.vo.MatchBoardInfoVO;
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
	private final MatchBoardInfoMapper matchBoardInfoMapper;

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
	 //team-members.html
	public PageInfo<TeamUserInfoVO> selectTeamUserInfosWithHelper(TeamUserInfoVO teamUserInfoVO) {
		PageHelper.startPage(teamUserInfoVO.getPage(), teamUserInfoVO.getPageSize());
		return new PageInfo<>(teamUserInfoMapper.selectTeamUserInfosWithHelper(teamUserInfoVO));
	}
	//team-members.html
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
	
	//team-profile.js
	public boolean checkTeamUserInfo(int taNum, int uiNum) {
		List<TeamUserInfoVO> teamUserInfoVOList = teamUserInfoMapper.selectTeamUsersByTaNum(taNum);
		for (TeamUserInfoVO teamUserInfoVO : teamUserInfoVOList) {
			if (teamUserInfoVO.getUiNum() == uiNum) {
				return true;
			}
		}
		return false;
	}

	public MsgVO deleteTeamUser(@RequestParam int taNum, TeamUserInfoVO teamUserInfo) {
		MsgVO msgVO = new MsgVO();
		List<TeamUserInfoVO> teamUserInfoVO = teamUserInfoMapper.selectTeamByTaNum(taNum);
		String userRole = teamUserInfo.getTuRole();
		if ("USER".equals(userRole)) {
			if (teamUserInfoVO.size() > 1) {
				int result = teamUserInfoMapper.deleteTeamUser(teamUserInfo);
				if (result == 1) {
					msgVO.setResultMsg("팀 탈퇴가 성공하였습니다.");
					return msgVO;
				} else {
					msgVO.setResultMsg("팀 탈퇴가 실패하였습니다.");
					return msgVO;
				}
			}
		} else if ("ADMIN".equals(userRole)) {
			if (teamUserInfoVO.size() > 1) {
				msgVO.setResultMsg("팀에 소속된 팀원이 있어서 불가능합니다.");
				return msgVO;
			} else if (teamUserInfoVO.size() == 1) {
				int result = teamUserInfoMapper.deleteTeamUser(teamUserInfo);
				if (result == 1) {
					TeamInfoVO teamInfoVO = new TeamInfoVO();
					String FulltaName = UUID.randomUUID() + "";
					String taName = FulltaName.substring(0, 5);
					teamInfoVO.setTaNum(taNum);
					teamInfoVO.setTaName(taName);
					int updateResult = teamInfoMapper.updateTeamTaActiveStatusInfo(teamInfoVO);
					if (updateResult == 1) {
						List<MatchBoardInfoVO> matchBoardInfoVOs = matchBoardInfoMapper.selectMatchInfosByTaNum(taNum);
						for (MatchBoardInfoVO matchBoardInfoVO : matchBoardInfoVOs) {
							matchBoardInfoMapper.deleteMatchBoardInfoActivityStatus(matchBoardInfoVO);
						}
					}
					msgVO.setResultMsg("팀 탈퇴가 성공하였습니다.");
					return msgVO;
				}
			}
		} else {
			msgVO.setResultMsg("팀에 속하지 않습니다.");
			return msgVO;
		}
		return msgVO;
	}
	
	//team-profile.js
	public int getTeamUserInfos(int taNum, UserInfoVO user) {
		TeamUserInfoVO teamUserInfoVO = new TeamUserInfoVO();
		teamUserInfoVO.setUiNum(user.getUiNum());
		teamUserInfoVO.setTaNum(taNum);
		if (teamUserInfoMapper.TeamUserRole(teamUserInfoVO) != null) {
			return 0;
		} else {
			return 1;
		}

	}
	//team-members.html //team-side.js
	public TeamUserInfoVO TeamUserRole(TeamUserInfoVO teamUserInfo, UserInfoVO user) {
		TeamUserInfoVO teamUserInfoVO = new TeamUserInfoVO();
		teamUserInfoVO.setUiNum(user.getUiNum());
		teamUserInfoVO.setTaNum(teamUserInfo.getTaNum());

		TeamUserInfoVO tuRole = teamUserInfoMapper.TeamUserRole(teamUserInfoVO);

		try {
			if (tuRole.getTuRole() != null) {
				if ("ADMIN".equals(tuRole.getTuRole())) {
					teamUserInfoVO.setTuRole("ADMIN");
				} else if ("USER".equals(tuRole.getTuRole())) {
					teamUserInfoVO.setTuRole("USER");
				}
			}
		} catch (NullPointerException e) {
			teamUserInfoVO.setTuRole("USER");
		}
		return teamUserInfoVO;
	}

}
