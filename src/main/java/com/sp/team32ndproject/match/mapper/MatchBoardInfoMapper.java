package com.sp.team32ndproject.match.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.sp.team32ndproject.match.vo.MatchBoardInfoVO;

import java.util.List;

@Mapper
public interface MatchBoardInfoMapper {
	int insertMatchInfo(MatchBoardInfoVO match);
	int updateMatchBoardInfoMbStatus(int mbNum);
	MatchBoardInfoVO selectMatchInfo(int mbNum);
	List<MatchBoardInfoVO> selectMatchList();
	int deleteMatchBoardInfoActivityStatus(MatchBoardInfoVO match);
}