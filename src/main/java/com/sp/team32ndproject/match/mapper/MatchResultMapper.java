package com.sp.team32ndproject.match.mapper;

import com.sp.team32ndproject.match.vo.MatchResultVO;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MatchResultMapper {
    int insertMatchResult(MatchResultVO matchResultVO);
    //팀이 홈팀일때 리스트
    List<MatchResultVO> selectMatchDealInfosByHomeNumWithHelper(MatchResultVO matchResultVO);
    //팀이 어웨이 일때
    List<MatchResultVO> selectMatchDealInfosByAwayNumWithHelper(MatchResultVO matchResultVO);
    //결과 업데이트
    int updateMatchResultInfoFirst (MatchResultVO matchResultVO);
}

