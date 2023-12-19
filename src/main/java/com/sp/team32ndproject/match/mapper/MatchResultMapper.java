package com.sp.team32ndproject.match.mapper;

import com.sp.team32ndproject.match.vo.MatchResultVO;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MatchResultMapper {
    void insertMatchResult(MatchResultVO matchResultVO);
    List<MatchResultVO> selectMatchResultInfoByHomeNum(MatchResultVO matchResultVO);
}

