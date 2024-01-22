package com.sp.team32ndproject.match.controller;

import com.github.pagehelper.PageInfo;
import com.sp.team32ndproject.match.service.MatchResultService;
import com.sp.team32ndproject.match.vo.MatchResultVO;
import com.sp.team32ndproject.team.vo.MsgVO;

import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class MatchResultController {
    @Autowired
    private MatchResultService matchResultService;
    
    //매치 수락 했을때 테이블 인서트
    @PostMapping("/match-result-infos") //record-script.js
    public MsgVO insertMatchResult(@RequestBody MatchResultVO matchResultVO) {
       return matchResultService.insertMatchResult(matchResultVO);
    }
    
    //경기 결과 입력 및 상태 업데이트
    @PatchMapping("/match-result-infos")
    public MsgVO updateMatchResultInfoFirst(@RequestBody MatchResultVO matchResultVO) {
    	return matchResultService.updateMatchResultInfoFirst(matchResultVO);
    }

	//record-script.js 
    @GetMapping("/auth/match-result-infos/stay")
    public  PageInfo<MatchResultVO> selectMatchResultInfosStay(MatchResultVO matchResultVO){
    	log.info("matchVO => {}", matchResultService.selectMatchResultInfosStay(matchResultVO));
    	return matchResultService.selectMatchResultInfosStay(matchResultVO);
    }
    
    @GetMapping("/auth/match-result-infos") //record-script.js
    public  PageInfo<MatchResultVO> selectMatchResultInfos(MatchResultVO matchResultVO){
    	log.info("matchVO => {}", matchResultService.selectMatchResultInfos(matchResultVO));
    	return matchResultService.selectMatchResultInfos(matchResultVO);
    }
}

