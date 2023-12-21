package com.sp.team32ndproject.match.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.sp.team32ndproject.match.mapper.MatchResultMapper;
import com.sp.team32ndproject.match.vo.MatchResultVO;
import com.sp.team32ndproject.team.service.TeamInfoService;
import com.sp.team32ndproject.team.vo.MsgVO;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MatchResultService {
	@Autowired
	private MatchResultMapper matchResultMapper;
	@Autowired
	private TeamInfoService teamInfoService;

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

	public PageInfo<MatchResultVO> selectMatchDealInfosByHomeNumWithHelper(MatchResultVO matchResultVO) {
		PageHelper.startPage(matchResultVO.getPage(), matchResultVO.getPageSize());
		List<MatchResultVO> selectHomeResults = matchResultMapper
				.selectMatchDealInfosByHomeNumWithHelper(matchResultVO);

		for (int i = 0; i < selectHomeResults.size(); i++) {
			if (selectHomeResults.get(i).getMrRequestStatus().equals("3")) {
				if (selectHomeResults.get(i).getMrHomeScore() > selectHomeResults.get(i).getMrAwayScore()) {
					selectHomeResults.get(i).setMrWinLoose("승리");
				} else if (selectHomeResults.get(i).getMrHomeScore() < selectHomeResults.get(i).getMrAwayScore()) {
					selectHomeResults.get(i).setMrWinLoose("패배");
				} else {
					selectHomeResults.get(i).setMrWinLoose("무승부");
				}
			}
		}

		return new PageInfo<>(selectHomeResults);
	}

	public PageInfo<MatchResultVO> selectMatchDealInfosByAwayNumWithHelper(MatchResultVO matchResultVO) {
		PageHelper.startPage(matchResultVO.getPage(), matchResultVO.getPageSize());
		List<MatchResultVO> selectHomeResults = matchResultMapper
				.selectMatchDealInfosByAwayNumWithHelper(matchResultVO);
		for (int i = 0; i < selectHomeResults.size(); i++) {
			if (selectHomeResults.get(i).getMrRequestStatus().equals("3")) {
				if (selectHomeResults.get(i).getMrHomeScore() < selectHomeResults.get(i).getMrAwayScore()) {
					selectHomeResults.get(i).setMrWinLoose("승리");
				} else if (selectHomeResults.get(i).getMrHomeScore() > selectHomeResults.get(i).getMrAwayScore()) {
					selectHomeResults.get(i).setMrWinLoose("패배");
				} else {
					selectHomeResults.get(i).setMrWinLoose("무승부");
				}
			}
		}

		return new PageInfo<>(selectHomeResults);
	}

	public MsgVO updateMatchResultInfoFirst(MatchResultVO matchResultVO) {
		MsgVO msgVO = new MsgVO();
		if (matchResultMapper.updateMatchResultInfoFirst(matchResultVO) == 1) {
			if(matchResultVO.getMrRequestStatus().equals("3")) {
				log.info("matchBoardInfo => {}", matchResultMapper.selectMatchResultInfo(matchResultVO));
				matchResultVO = matchResultMapper.selectMatchResultInfo(matchResultVO);
				teamInfoService.doUpdateHomeMatchResult(matchResultVO);
				teamInfoService.doUpdateAwayMatchResult(matchResultVO);
			}
			msgVO.setResultMsg("결과 입력 완료");
		} else {
			msgVO.setResultMsg("결과 입력 실패 다시 시도 해주세요");
		}
		return msgVO;
	}
}
