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
	
	//team-members.html
	int deleteMatchBoardInfoActivityStatus(MatchBoardInfoVO match);
	
	//team-members.html //team-match-list.html
	List<MatchBoardInfoVO> selectMatchInfosByTaNum(int taNum);
	
	int updateMatchBoardInfo(MatchBoardInfoVO matchBoardInfoVO);
}