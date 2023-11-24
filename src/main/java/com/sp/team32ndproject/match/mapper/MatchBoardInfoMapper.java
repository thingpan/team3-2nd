package com.sp.team32ndproject.match.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.sp.team32ndproject.match.vo.MatchBoardInfoVO;

@Mapper 
public interface MatchBoardInfoMapper {
	int insertMatchInfo(MatchBoardInfoVO match);
}
