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
		if (matchResultMapper.updateMatchResultInfoFirst(matchResultVO) == 1) {
			if (matchResultVO.getMrRequestStatus().equals("3")) {
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
	
	public PageInfo<MatchResultVO> selectMatchResultInfosStay(MatchResultVO matchResultVO){
		PageHelper.startPage(matchResultVO.getPage(), matchResultVO.getPageSize());
		return new PageInfo<>(matchResultMapper.selectMatchResultInfosStay(matchResultVO));
	}
	
	public PageInfo<MatchResultVO> selectMatchResultInfos(MatchResultVO matchResultVO){
		PageHelper.startPage(matchResultVO.getPage(), matchResultVO.getPageSize());
		log.info("Result => {}",matchResultMapper.selectMatchResultInfos(matchResultVO));
		return new PageInfo<>(matchResultMapper.selectMatchResultInfos(matchResultVO));
	}
}
