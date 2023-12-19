package com.sp.team32ndproject.match.mapper;

import com.sp.team32ndproject.match.vo.MatchDealInfoVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface MatchDealInfoMapper {
    MatchDealInfoVO getMatchDealInfoById(int mdNum);

    int insertMatchDealInfo(MatchDealInfoVO matchDealInfoVO);

    List<MatchDealInfoVO> getAllMatchDealInfo();

    List<MatchDealInfoVO> getMatchDealInfoForHomeTeam(int taNum);

    List<MatchDealInfoVO> getMatchDealInfoForAwayTeam(int mbNum);
    
    MatchDealInfoVO selectMatchDealInfoByMbNumAndTaNum(MatchDealInfoVO matchDealInfoVO);

    void updateMatchDealStatus(MatchDealInfoVO matchDealInfoVO);
    int deleteMatchDealStatus(MatchDealInfoVO matchDealInfoVO);
}
