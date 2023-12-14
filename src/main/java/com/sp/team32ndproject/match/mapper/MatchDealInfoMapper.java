package com.sp.team32ndproject.match.mapper;

import com.sp.team32ndproject.match.vo.MatchDealInfoVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MatchDealInfoMapper {
    int insertMatchDealInfo(MatchDealInfoVO matchDealInfo);
    List<MatchDealInfoVO> getAllMatchDealInfo();
}

