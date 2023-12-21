package com.sp.team32ndproject.match.controller;

import com.github.pagehelper.PageInfo;
import com.sp.team32ndproject.match.service.MatchResultService;
import com.sp.team32ndproject.match.vo.MatchResultVO;
import com.sp.team32ndproject.team.vo.MsgVO;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MatchResultController {
    @Autowired
    private MatchResultService matchResultService;
    
    //매치 수락 했을때 테이블 인서트
    @PostMapping("/match-result-infos")
    public MsgVO insertMatchResult(@RequestBody MatchResultVO matchResultVO) {
       return matchResultService.insertMatchResult(matchResultVO);
    }
    
    //나의팀이 홈팀인 매치 불러오기
    @GetMapping("/match-result-home-infos")
    public PageInfo<MatchResultVO> selectMatchResultInfoByHomeNum(MatchResultVO matchResultVO){
    	return matchResultService.selectMatchDealInfosByHomeNumWithHelper(matchResultVO);
    }
    
    //나의팀이 어웨이팀인 매치 불러오기
    @GetMapping("/match-result-away-infos")
    public PageInfo<MatchResultVO> selectMatchResultInfoByAwayNum(MatchResultVO matchResultVO){
    	return matchResultService.selectMatchDealInfosByAwayNumWithHelper(matchResultVO);
    }
    
    //경기 결과 입력 및 상태 업데이트
    @PatchMapping("/match-result-infos")
    public MsgVO updateMatchResultInfoFirst(@RequestBody MatchResultVO matchResultVO) {
    	return matchResultService.updateMatchResultInfoFirst(matchResultVO);
    }
}

