package com.sp.team32ndproject.match.service;

import com.sp.team32ndproject.match.mapper.MatchDealInfoMapper;
import com.sp.team32ndproject.match.vo.MatchDealInfoVO;
import com.sp.team32ndproject.team.vo.TeamSignUserInfoVO;
import com.sp.team32ndproject.team.vo.TeamUserInfoVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public int insertMatchDealInfo(MatchDealInfoVO matchDealInfoVO) {
        matchDealInfoVO.setMdMatchStatus("0"); // 0: 대기 중, 1: 수락, 2: 거절
        return matchDealInfoMapper.insertMatchDealInfo(matchDealInfoVO);
    }

    public int deleteMatchStatusInfo(MatchDealInfoVO matchDealInfoVO) {
        return matchDealInfoMapper.deleteMatchDealStatus(matchDealInfoVO);
    }
}