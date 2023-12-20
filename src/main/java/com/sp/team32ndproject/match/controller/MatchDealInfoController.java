package com.sp.team32ndproject.match.controller;

import com.github.pagehelper.PageInfo;
import com.sp.team32ndproject.match.mapper.MatchDealInfoMapper;
import com.sp.team32ndproject.match.service.MatchDealInfoService;
import com.sp.team32ndproject.match.vo.MatchDealInfoVO;
import com.sp.team32ndproject.team.vo.MsgVO;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Slf4j
@RestController
public class MatchDealInfoController {
    @Autowired
    private MatchDealInfoService matchDealInfoService;

    @PostMapping("/math-deal-infos")
    public MsgVO insertMatchDealInfo(@RequestBody MatchDealInfoVO matchDealInfoVO) {
       return matchDealInfoService.insertMatchDealInfo(matchDealInfoVO);
    }
    
    @GetMapping("/math-deal-home-infos")
    public PageInfo<MatchDealInfoVO> selectMatchDealInfosByHomeNumWithHelper(MatchDealInfoVO matchDealInfoVO){
    	return matchDealInfoService.selectMatchDealInfosByHomeNumWithHelper(matchDealInfoVO);
    }
    
    @GetMapping("/math-deal-away-infos")
    public PageInfo<MatchDealInfoVO> selectMatchDealInfosByAwayNumWithHelper(MatchDealInfoVO matchDealInfoVO){
    	return matchDealInfoService.selectMatchDealInfosByAwayNumWithHelper(matchDealInfoVO);
    }
    
    @PatchMapping("/match-result-infos")
    public MsgVO updateMatchDealInfoMdMatchStatus(@RequestBody MatchDealInfoVO matchDealInfoVO) {
    	return matchDealInfoService.updateMatchDealInfoMdMatchStatus(matchDealInfoVO);
    }
   
    
}