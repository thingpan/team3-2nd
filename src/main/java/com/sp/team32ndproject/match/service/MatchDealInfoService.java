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

    public void saveMatchDealInfo(MatchDealInfoVO matchDealInfo) {
        matchDealInfoMapper.insertMatchDealInfo(matchDealInfo);
    }

    public List<MatchDealInfoVO> getAllMatchDealInfo() {
        return matchDealInfoMapper.getAllMatchDealInfo();
    }

    public int insertMatchDealInfo(MatchDealInfoVO matchDealInfoVO) {
        matchDealInfoVO.setMdNum(matchDealInfoVO.getMbNum());
        matchDealInfoVO.setTaName(matchDealInfoVO.getTaName());
        return matchDealInfoMapper.insertMatchDealInfo(matchDealInfoVO);
    }
}

