package com.sp.team32ndproject.match.controller;

import com.sp.team32ndproject.match.service.MatchDealInfoService;
import com.sp.team32ndproject.match.vo.MatchDealInfoVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/match-deal")
public class MatchDealInfoController {
    @Autowired
    private MatchDealInfoService matchDealInfoService;

    @PostMapping("/save")
    public ResponseEntity<String> saveMatchDealInfo(@RequestBody MatchDealInfoVO matchDealInfo) {
        matchDealInfoService.saveMatchDealInfo(matchDealInfo);
        return ResponseEntity.ok("매칭현황에 저장 성공");
    }

    @GetMapping("/all")
    public ResponseEntity<List<MatchDealInfoVO>> getAllMatchDealInfo() {
        List<MatchDealInfoVO> matchDealInfoList = matchDealInfoService.getAllMatchDealInfo();
        return new ResponseEntity<>(matchDealInfoList, HttpStatus.OK);
    }
}
