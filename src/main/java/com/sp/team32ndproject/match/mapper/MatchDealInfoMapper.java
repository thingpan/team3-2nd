package com.sp.team32ndproject.match.mapper;

import com.github.pagehelper.PageInfo;
import com.sp.team32ndproject.match.vo.MatchDealInfoVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface MatchDealInfoMapper {
	//매치 신청
    int insertMatchDealInfo(MatchDealInfoVO matchDealInfoVO);
    //이미 신청한 매치 중복 확인
    MatchDealInfoVO selectMatchDealInfoByMbNumAndTaNum(MatchDealInfoVO matchDealInfoVO);
    //홈팀 게시글 신청 목록 불러오기
    List<MatchDealInfoVO> selectMatchDealInfosByHomeNumWithHelper(int taNum);
    //어웨이팀 게시글 신청 목록 불러오기
    List<MatchDealInfoVO> selectMatchDealInfosByAwayNumWithHelper(int taNum);
    //매치 딜 상태 업데이트
    int updateMatchDealInfoMdMatchStatus(MatchDealInfoVO matchDealInfoVO);
    //매치 딜 상태 나머지 거절로 업데이트
    int updateMatchDealInfoRemainStatus(MatchDealInfoVO matchDealInfoVO);
}
