package com.sp.team32ndproject.match.mapper;

import com.sp.team32ndproject.match.vo.MatchDealInfoVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface MatchDealInfoMapper {
    int insertMatchDealInfo(MatchDealInfoVO matchDealInfoVO);

    List<MatchDealInfoVO> getAllMatchDealInfo();

    List<MatchDealInfoVO> getMatchDealInfoByMatchBoardNum(int mbNum);

    List<MatchDealInfoVO> getMatchDealInfoByMatchDealNum(int mdsNum);

    List<MatchDealInfoVO> getMatchDealInfoForHomeTeam(int mbNum);

    List<MatchDealInfoVO> getMatchDealInfoForAwayTeam(int mbNum);
    void completeMatch(@Param("mbNum") int mbNum, @Param("result") String result);
    void updateMatchDealStatus(MatchDealInfoVO matchDealInfoVO);
    int deleteMatchDealStatus(MatchDealInfoVO matchDealInfoVO);
}
