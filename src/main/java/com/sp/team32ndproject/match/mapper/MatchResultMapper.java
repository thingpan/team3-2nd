package com.sp.team32ndproject.match.mapper;

import com.sp.team32ndproject.match.vo.MatchBoardInfoVO;
import com.sp.team32ndproject.match.vo.MatchResultVO;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MatchResultMapper {
    int insertMatchResult(MatchResultVO matchResultVO);
    //결과 업데이트
    int updateMatchResultInfo(MatchResultVO matchResultVO);
    //단일조회
    MatchResultVO selectMatchResultInfo(MatchResultVO matchResultVO);
    
    List<MatchResultVO> selectMatchResultInfosStay(MatchResultVO matchResultVO);
    
    List<MatchResultVO> selectMatchResultInfos(MatchResultVO matchResultVO);
    
    
}

