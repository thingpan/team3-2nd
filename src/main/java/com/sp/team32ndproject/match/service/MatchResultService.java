package com.sp.team32ndproject.match.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.sp.team32ndproject.match.mapper.MatchResultMapper;
import com.sp.team32ndproject.match.vo.MatchResultVO;
import com.sp.team32ndproject.team.mapper.TeamInfoMapper;
import com.sp.team32ndproject.team.service.TeamInfoService;
import com.sp.team32ndproject.team.vo.MsgVO;
import com.sp.team32ndproject.team.vo.TeamInfoVO;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MatchResultService {
	@Autowired
	private MatchResultMapper matchResultMapper;
	@Autowired
	private TeamInfoService teamInfoService;
	@Autowired
	private TeamInfoMapper teamInfoMapper;

	// record-script.js
	public MsgVO insertMatchResult(MatchResultVO matchResultVO) {
		MsgVO msgVO = new MsgVO();
		try {
			int result = matchResultMapper.insertMatchResult(matchResultVO);
			if (result == 1) {
				msgVO.setResultMsg("매치 수락 성공");
			} else {
				msgVO.setResultMsg("매치 수락 실패 다시 시도 해주세요");
			}

		} catch (Exception e) {
			msgVO.setResultMsg("오류가 발생했습니다 다시 시도 해주세요");
		}
		return msgVO;
	}

	public MsgVO updateMatchResultInfoFirst(MatchResultVO matchResultVO) {
		MsgVO msgVO = new MsgVO();
		if (matchResultVO.getMrRequestStatus().equals("1")) {
			if (matchResultVO.getMrHomeScore() > matchResultVO.getMrAwayScore()) {
				matchResultVO.setMrHomeResult("w");
				matchResultVO.setMrAwayResult("l");
			} else if (matchResultVO.getMrHomeScore() < matchResultVO.getMrAwayScore()) {
				matchResultVO.setMrHomeResult("l");
				matchResultVO.setMrAwayResult("w");
			} else {
				matchResultVO.setMrHomeResult("d");
				matchResultVO.setMrAwayResult("d");
			}
		}
		try {
			matchResultMapper.updateMatchResultInfo(matchResultVO);
			msgVO.setResultMsg("결과 입력 완료");
			if (matchResultVO.getMrRequestStatus().equals("3")) {
				matchResultVO = matchResultMapper.selectMatchResultInfo(matchResultVO);
				try {
					teamInfoService.doUpdateHomeMatchResult(matchResultVO);
					teamInfoService.doUpdateAwayMatchResult(matchResultVO);
				} catch (Exception e) {
					// TODO: handle exception
				}
			}
			return msgVO;
		} catch (Exception e) {
			msgVO.setResultMsg("결과 입력 실패 다시 시도 해주세요");
			return msgVO;
		}
	}

	// record-script.js
	public PageInfo<MatchResultVO> selectMatchResultInfosStay(MatchResultVO matchResultVO) {
		if (matchResultVO.getMrSearchType().equals("all")) {
			PageHelper.startPage(matchResultVO.getPage(), matchResultVO.getPageSize());
			List<MatchResultVO> matchResultVOs = matchResultMapper.selectMatchResultInfosStayAll(matchResultVO);
			for (int i = 0; i < matchResultVOs.size(); i++) {
				int myTaNum = matchResultVO.getTaNum();
				int homeNum = matchResultVOs.get(i).getTaHomeNum();
				int awayNum = matchResultVOs.get(i).getTaAwayNum();
				String opTaName = "";
				if (myTaNum == homeNum) {
					TeamInfoVO teamInfoVO = teamInfoMapper.selectTeamInfoByTaNum(awayNum);
					if (teamInfoVO != null) {
						opTaName = teamInfoVO.getTaName();
					} else {
						opTaName = "삭제된 팀";
					}
					matchResultVOs.get(i).setTaName(opTaName);
				} else if (myTaNum == awayNum) {
					TeamInfoVO teamInfoVO = teamInfoMapper.selectTeamInfoByTaNum(homeNum);
					if (teamInfoVO != null) {
						opTaName = teamInfoVO.getTaName();
					} else {
						opTaName = "삭제된 팀";
					}
					matchResultVOs.get(i).setTaName(opTaName);
				}
			}
			return new PageInfo<MatchResultVO>(matchResultVOs);
		}
		PageHelper.startPage(matchResultVO.getPage(), matchResultVO.getPageSize());
		return new PageInfo<>(matchResultMapper.selectMatchResultInfosStay(matchResultVO));
	}

	// record-script.js
	public PageInfo<MatchResultVO> selectMatchResultInfos(MatchResultVO matchResultVO) {
		if (matchResultVO.getMrSearchType().equals("all")) {
			PageHelper.startPage(matchResultVO.getPage(), matchResultVO.getPageSize());
			List<MatchResultVO> matchResultVOs = matchResultMapper.selectMatchResultInfosAll(matchResultVO);
			for (int i = 0; i < matchResultVOs.size(); i++) {
				int myTaNum = matchResultVO.getTaNum();
				int homeNum = matchResultVOs.get(i).getTaHomeNum();
				int awayNum = matchResultVOs.get(i).getTaAwayNum();
				String opTaName = "";
				if (myTaNum == homeNum) {
					TeamInfoVO teamInfoVO = teamInfoMapper.selectTeamInfoByTaNumWithOutStatus(awayNum);
					if (teamInfoVO != null) {
						opTaName = teamInfoVO.getTaName();
					} else {
						opTaName = "삭제된 팀";
					}
					matchResultVOs.get(i).setTaName(opTaName);
				} else if (myTaNum == awayNum) {
					TeamInfoVO teamInfoVO = teamInfoMapper.selectTeamInfoByTaNumWithOutStatus(homeNum);
					if (teamInfoVO != null) {
						opTaName = teamInfoVO.getTaName();
					} else {
						opTaName = "삭제된 팀";
					}
					matchResultVOs.get(i).setTaName(opTaName);
				}
			}
			return new PageInfo<MatchResultVO>(matchResultVOs);
		}
		PageHelper.startPage(matchResultVO.getPage(), matchResultVO.getPageSize());
		return new PageInfo<>(matchResultMapper.selectMatchResultInfos(matchResultVO));
	}
}
