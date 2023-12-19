package com.sp.team32ndproject.match.service;

import com.sp.team32ndproject.match.mapper.MatchDealInfoMapper;
import com.sp.team32ndproject.match.vo.MatchDealInfoVO;
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

    public MatchDealInfoVO getMatchDealInfoById(int mdNum) {
        return matchDealInfoMapper.getMatchDealInfoById(mdNum);
    }

    public List<MatchDealInfoVO> getAllMatchDealInfo() {
        return matchDealInfoMapper.getAllMatchDealInfo();
    }

    public List<MatchDealInfoVO> getMatchDealInfoForHomeTeam(int taNum) {
        return matchDealInfoMapper.getMatchDealInfoForHomeTeam(taNum);
    }

    public List<MatchDealInfoVO> getMatchDealInfoForAwayTeam(int mbNum) {
        return matchDealInfoMapper.getMatchDealInfoForAwayTeam(mbNum);
    }

    public void updateMatchDealStatus(MatchDealInfoVO matchDealInfoVO) {
        matchDealInfoMapper.updateMatchDealStatus(matchDealInfoVO);
    }

    public ResponseEntity<Map<String, String>> insertMatchDealInfo(MatchDealInfoVO matchDealInfoVO) {
    	
        matchDealInfoVO.setMdMatchStatus("0"); // 0: 대기 중, 1: 수락, 2: 거절
        Map<String, String> response = new HashMap<>();
        if(matchDealInfoMapper.selectMatchDealInfoByMbNumAndTaNum(matchDealInfoVO) != null) {
            response.put("status", "duplicate");
            response.put("message", "이미 신청된 매치 입니다.");
        }else {
            try {
                // 매칭 신청 로직 추가
                matchDealInfoVO.setMdMatchStatus("0"); // 0: 대기 중, 1: 수락, 2: 거절
                int affectedRows =matchDealInfoMapper.insertMatchDealInfo(matchDealInfoVO);

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
        }
        return ResponseEntity.ok(response);
    }

    public int deleteMatchStatusInfo(MatchDealInfoVO matchDealInfoVO) {
        return matchDealInfoMapper.deleteMatchDealStatus(matchDealInfoVO);
    }
}