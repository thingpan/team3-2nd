package com.sp.team32ndproject.match.service;

import com.sp.team32ndproject.match.mapper.MatchResultMapper;
import com.sp.team32ndproject.match.vo.MatchResultVO;
import com.sp.team32ndproject.team.vo.MsgVO;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MatchResultService {
	@Autowired
	private MatchResultMapper matchResultMapper;

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

	public List<MatchResultVO> selectMatchResultInfoByHomeNum(MatchResultVO matchResultVO) {
		return matchResultMapper.selectMatchResultInfoByHomeNum(matchResultVO);
	}
}
