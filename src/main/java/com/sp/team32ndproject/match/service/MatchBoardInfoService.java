package com.sp.team32ndproject.match.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sp.team32ndproject.match.mapper.MatchBoardInfoMapper;
import com.sp.team32ndproject.match.vo.MatchBoardInfoVO;
import com.sp.team32ndproject.match.vo.MatchBoardPhotoInfoVO;
import com.sp.team32ndproject.team.mapper.TeamInfoMapper;
import com.sp.team32ndproject.team.vo.TeamInfoVO;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class MatchBoardInfoService {
	
	private final MatchBoardInfoMapper matchBoardInfoMapper;
	private final MatchBoardPhotoInfoService matchBoardPhotoInfoService; 
	private final TeamInfoMapper teamInfoMapper;
	
	public int insertMatchInfo(MatchBoardInfoVO matchBoardInfoVO) {
		matchBoardInfoVO.setMbType(teamInfoMapper.selectTaTypeMatchBoardInfoByTaNum(matchBoardInfoVO.getTaNum()).getTaType());
		int result = matchBoardInfoMapper.insertMatchInfo(matchBoardInfoVO);
		List<MatchBoardPhotoInfoVO> matchPhotos = matchBoardInfoVO.getMatchPhotos();
		result += matchBoardPhotoInfoService.insertMatchBoardPhotoInfo(matchBoardInfoVO.getMbNum(), matchPhotos);
		return result;
	}

	public List<MatchBoardInfoVO> selectMatchInfos(int mbNum) {
		return matchBoardInfoMapper.selectMatchInfos(mbNum);
	}
}
