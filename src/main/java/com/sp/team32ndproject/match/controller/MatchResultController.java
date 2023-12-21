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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MatchResultController {
    @Autowired
    private MatchResultService matchResultService;

    @PostMapping("/match-result-infos")
    public MsgVO insertMatchResult(@RequestBody MatchResultVO matchResultVO) {
       return matchResultService.insertMatchResult(matchResultVO);
    }
    
    @GetMapping("/match-result-home-infos")
    public PageInfo<MatchResultVO> selectMatchResultInfoByHomeNum(MatchResultVO matchResultVO){
    	return matchResultService.selectMatchDealInfosByHomeNumWithHelper(matchResultVO);
    }
}

