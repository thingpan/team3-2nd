package com.sp.team32ndproject.match.service;

import com.sp.team32ndproject.match.mapper.MatchDealInfoMapper;
import com.sp.team32ndproject.match.vo.MatchDealInfoVO;
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

    // 모든 매치 딜 정보를 가져오기 위한 메소드 추가
    public List<MatchDealInfoVO> getAllMatchDealInfo() {
        return matchDealInfoMapper.getAllMatchDealInfo();
    }
}

