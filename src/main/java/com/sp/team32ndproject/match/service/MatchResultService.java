package com.sp.team32ndproject.match.service;

import com.sp.team32ndproject.match.mapper.MatchResultMapper;
import com.sp.team32ndproject.match.vo.MatchResultVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MatchResultService {
    @Autowired
    private MatchResultMapper matchResultMapper;

    public void insertMatchResult(MatchResultVO matchResultVO) {
        matchResultMapper.insertMatchResult(matchResultVO);
    }
}

