package com.sp.team32ndproject.match.controller;

import com.sp.team32ndproject.match.service.MatchResultService;
import com.sp.team32ndproject.match.vo.MatchResultVO;

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
@RequestMapping("/match-result")
public class MatchResultController {
    @Autowired
    private MatchResultService matchResultService;

    @PostMapping("/insert")
    public ResponseEntity<String> insertMatchResult(@RequestBody MatchResultVO matchResultVO) {
        try {
            matchResultService.insertMatchResult(matchResultVO);
            return ResponseEntity.ok("경기 결과가 저장되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("경기 결과 저장 중 오류가 발생했습니다.");
        }
    }
    
    @GetMapping("/match-result-home-infos/{taNum}")
    public List<MatchResultVO> selectMatchResultInfoByHomeNum(@PathVariable int taNum){
    	MatchResultVO matchResultVO = new MatchResultVO();
    	matchResultVO.setTaHomeNum(taNum);
    	return matchResultService.selectMatchResultInfoByHomeNum(matchResultVO);
    }
}

