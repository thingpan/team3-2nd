package com.sp.team32ndproject.match.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.sp.team32ndproject.match.vo.MatchBoardPhotoInfoVO;

@Mapper
public interface MatchBoardPhotoInfoMapper {
	int insertMatchBoardPhotoInfo(MatchBoardPhotoInfoVO matchPhoto);
	List<MatchBoardPhotoInfoVO> selectMatchBoardInfo(int mbNum);
}
