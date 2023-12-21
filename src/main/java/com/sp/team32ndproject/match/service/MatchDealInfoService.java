package com.sp.team32ndproject.match.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.sp.team32ndproject.match.mapper.MatchDealInfoMapper;
import com.sp.team32ndproject.match.vo.MatchDealInfoVO;
import com.sp.team32ndproject.team.vo.MsgVO;
import com.sp.team32ndproject.team.vo.TeamSignUserInfoVO;
import com.sp.team32ndproject.team.vo.TeamUserInfoVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MatchDealInfoService {
    @Autowired
    private MatchDealInfoMapper matchDealInfoMapper;
    @Autowired
    private MatchBoardInfoService matchBoardInfoService;

    public MsgVO insertMatchDealInfo(MatchDealInfoVO matchDealInfoVO) {
    	MsgVO msgVO = new MsgVO();
        matchDealInfoVO.setMdMatchStatus("0"); // 0: 대기 중, 1: 수락, 2: 거절
        if(matchDealInfoMapper.selectMatchDealInfoByMbNumAndTaNum(matchDealInfoVO) != null) {
            msgVO.setResultMsg("이미 신청된 게시글 입니다.");
        }else {
            try {
                // 매칭 신청 로직 추가
                matchDealInfoVO.setMdMatchStatus("0"); // 0: 대기 중, 1: 수락, 2: 거절
                int affectedRows =matchDealInfoMapper.insertMatchDealInfo(matchDealInfoVO);

                // 적절한 조건에 따라 성공 여부 판단
                if (affectedRows > 0) {
                	msgVO.setResultMsg("매치 신청 성공");
                } else {
                	msgVO.setResultMsg("매치 신청 실패 다시 시도해 주세요");
                }
            } catch (Exception e) {
                // 예외가 발생하면 실패로 처리
                e.printStackTrace(); // 예외 정보 출력
                msgVO.setResultMsg("매치 신청 중 오류가 발생했습니다.");
            }
        }
        return msgVO;
    }
    
    public PageInfo<MatchDealInfoVO> selectMatchDealInfosByHomeNumWithHelper(MatchDealInfoVO matchDealInfoVO){
    	PageHelper.startPage(matchDealInfoVO.getPage(), matchDealInfoVO.getPageSize());
    	return new PageInfo<>(matchDealInfoMapper.selectMatchDealInfosByHomeNumWithHelper(matchDealInfoVO.getTaNum()));
    }
    
    public PageInfo<MatchDealInfoVO> selectMatchDealInfosByAwayNumWithHelper(MatchDealInfoVO matchDealInfoVO){
    	PageHelper.startPage(matchDealInfoVO.getPage(), matchDealInfoVO.getPageSize());
    	return new PageInfo<>(matchDealInfoMapper.selectMatchDealInfosByAwayNumWithHelper(matchDealInfoVO.getTaNum()));
    }
    
    public MsgVO updateMatchDealInfoMdMatchStatus(MatchDealInfoVO matchDealInfoVO) {
    	MsgVO msgVO = new MsgVO();
    	if(matchDealInfoVO.getMdMatchStatus().equals("1")) {
    		if(matchDealInfoMapper.updateMatchDealInfoMdMatchStatus(matchDealInfoVO) == 1) {
    			matchDealInfoMapper.updateMatchDealInfoRemainStatus(matchDealInfoVO);
    			matchBoardInfoService.updateMatchBoardInfoMbStatus(matchDealInfoVO.getMbNum());
    		}
    	}
    	if(matchDealInfoMapper.updateMatchDealInfoMdMatchStatus(matchDealInfoVO) == 1) {
    		msgVO.setResultMsg("거절 성공");
    	}else {
    		msgVO.setResultMsg("거절 실패 다시 시도 해주세요");
    	}
    	return msgVO;
    }

}