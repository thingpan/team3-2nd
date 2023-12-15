package com.sp.team32ndproject.match.service;

import com.sp.team32ndproject.match.mapper.MatchDealInfoMapper;
import com.sp.team32ndproject.match.vo.MatchDealInfoVO;
import com.sp.team32ndproject.team.vo.TeamSignUserInfoVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MatchDealInfoService {
    @Autowired
    private MatchDealInfoMapper matchDealInfoMapper;

    public void saveMatchDealInfo(MatchDealInfoVO matchDealInfo) {
        matchDealInfoMapper.insertMatchDealInfo(matchDealInfo);
    }

    public List<MatchDealInfoVO> getAllMatchDealInfo() {
        return matchDealInfoMapper.getAllMatchDealInfo();
    }

    public List<MatchDealInfoVO> getMatchDealInfoByMatchBoardNum(int mbNum) {
        return matchDealInfoMapper.getMatchDealInfoByMatchBoardNum(mbNum);
    }

    public List<MatchDealInfoVO> getMatchDealInfoByMatchDealNum(int mdsNum) {
        return matchDealInfoMapper.getMatchDealInfoByMatchDealNum(mdsNum);
    }

    public List<MatchDealInfoVO> getMatchDealInfoForHomeTeam(int mbNum) {
        return matchDealInfoMapper.getMatchDealInfoForHomeTeam(mbNum);
    }

    public List<MatchDealInfoVO> getMatchDealInfoForAwayTeam(int mbNum) {
        return matchDealInfoMapper.getMatchDealInfoForAwayTeam(mbNum);
    }

    public void completeMatch(int mbNum, String result) {
        matchDealInfoMapper.completeMatch(mbNum, result);
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