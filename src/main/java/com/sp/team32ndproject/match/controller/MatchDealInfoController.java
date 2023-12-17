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
        Map<String, String> response = new HashMap<>();

        try {
            // 매칭 신청 로직 추가
            matchDealInfoVO.setMdMatchStatus("0"); // 0: 대기 중, 1: 수락, 2: 거절
            int affectedRows = matchDealInfoService.insertMatchDealInfo(matchDealInfoVO);

            // 적절한 조건에 따라 성공 여부 판단
            if (affectedRows > 0) {
                response.put("status", "success");
                response.put("message", "매치 신청이 성공했습니다.");
            } else {
                response.put("status", "error");
                response.put("message", "매치 신청이 실패했습니다.");
            }
        } catch (Exception e) {
            // 예외가 발생하면 실패로 처리
            e.printStackTrace(); // 예외 정보 출력
            response.put("status", "error");
            response.put("message", "매치 신청 중 오류가 발생했습니다.");
        }

        return ResponseEntity.ok(response);
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