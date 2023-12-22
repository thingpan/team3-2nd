package com.sp.team32ndproject.match.controller;

import com.github.pagehelper.PageInfo;
import com.sp.team32ndproject.match.mapper.MatchDealInfoMapper;
import com.sp.team32ndproject.match.service.MatchDealInfoService;
import com.sp.team32ndproject.match.vo.MatchDealInfoVO;
import com.sp.team32ndproject.team.vo.MsgVO;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
public class MatchDealInfoController {
    @Autowired
    private MatchDealInfoService matchDealInfoService;
    
    //매치 신청 인서트
    @PostMapping("/math-deal-infos")
    public MsgVO insertMatchDealInfo(@RequestBody MatchDealInfoVO matchDealInfoVO) {
       return matchDealInfoService.insertMatchDealInfo(matchDealInfoVO);
    }
    
    //나의 팀이 홈팀일때 신청 목록 불러오기
    @GetMapping("/math-deal-home-infos")
    public PageInfo<MatchDealInfoVO> selectMatchDealInfosByHomeNumWithHelper(MatchDealInfoVO matchDealInfoVO){
    	return matchDealInfoService.selectMatchDealInfosByHomeNumWithHelper(matchDealInfoVO);
    }
    
    //나의 팀이 신청한 목록 불러오기
    @GetMapping("/math-deal-away-infos")
    public PageInfo<MatchDealInfoVO> selectMatchDealInfosByAwayNumWithHelper(MatchDealInfoVO matchDealInfoVO){
    	return matchDealInfoService.selectMatchDealInfosByAwayNumWithHelper(matchDealInfoVO);
    }
    
    //매치 신청 거절 혹은 수락 업데이트
    @PatchMapping("/match-deal-infos")
    public MsgVO updateMatchDealInfoMdMatchStatus(@RequestBody MatchDealInfoVO matchDealInfoVO) {
    	return matchDealInfoService.updateMatchDealInfoMdMatchStatus(matchDealInfoVO);
    }
   
    
}