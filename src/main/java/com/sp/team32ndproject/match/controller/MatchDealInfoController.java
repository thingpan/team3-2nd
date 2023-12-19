package com.sp.team32ndproject.match.controller;

import com.sp.team32ndproject.match.mapper.MatchDealInfoMapper;
import com.sp.team32ndproject.match.service.MatchDealInfoService;
import com.sp.team32ndproject.match.vo.MatchDealInfoVO;
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
@RequestMapping("/match-deal")
public class MatchDealInfoController {
    @Autowired
    private MatchDealInfoService matchDealInfoService;

    @GetMapping("/{mdNum}")
    public ResponseEntity<MatchDealInfoVO> getMatchDealInfoById(@PathVariable int mdNum) {
        MatchDealInfoVO matchDealInfo = matchDealInfoService.getMatchDealInfoById(mdNum);

        if (matchDealInfo != null) {
            return new ResponseEntity<>(matchDealInfo, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<MatchDealInfoVO>> getAllMatchDealInfo() {
        List<MatchDealInfoVO> matchDealInfoList = matchDealInfoService.getAllMatchDealInfo();
        return new ResponseEntity<>(matchDealInfoList, HttpStatus.OK);
    }

    @PostMapping("/insert")
    public ResponseEntity<Map<String, String>> insertMatchDealInfo(@RequestBody MatchDealInfoVO matchDealInfoVO) {
       return matchDealInfoService.insertMatchDealInfo(matchDealInfoVO);
    }

    @GetMapping("/home-team/{taNum}")
    public ResponseEntity<List<MatchDealInfoVO>> getMatchDealInfoForHomeTeam(@PathVariable int taNum) {
        List<MatchDealInfoVO> matchDealInfoList = matchDealInfoService.getMatchDealInfoForHomeTeam(taNum);
        return new ResponseEntity<>(matchDealInfoList, HttpStatus.OK);
    }

    @GetMapping("/away-team/{mdsNum}")
    public ResponseEntity<List<MatchDealInfoVO>> getMatchDealInfoForAwayTeam(@PathVariable int mdsNum) {
        List<MatchDealInfoVO> matchDealInfoList = matchDealInfoService.getMatchDealInfoForAwayTeam(mdsNum);
        return new ResponseEntity<>(matchDealInfoList, HttpStatus.OK);
    }

    @PutMapping("/update-status")
    public ResponseEntity<String> updateMatchDealStatus(@RequestBody MatchDealInfoVO matchDealInfoVO) {
        matchDealInfoService.updateMatchDealStatus(matchDealInfoVO);
        return ResponseEntity.ok("매칭현황 상태 업데이트 성공");
    }

    @DeleteMapping("/delete-status")
    public int deleteTeamSignUserInfo(@RequestBody MatchDealInfoVO matchDealInfoVO) {
        log.info("matchDealDate => {}", matchDealInfoVO);
        return matchDealInfoService.deleteMatchStatusInfo(matchDealInfoVO);
    }
}