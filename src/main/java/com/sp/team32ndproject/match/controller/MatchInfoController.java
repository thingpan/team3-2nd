package com.sp.team32ndproject.match.controller;

import java.io.IOException;
import java.util.List;

import com.sp.team32ndproject.match.vo.MatchBoardInfoListVO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.github.pagehelper.PageInfo;
import com.sp.team32ndproject.match.service.MatchBoardInfoService;
import com.sp.team32ndproject.match.vo.MatchBoardInfoVO;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
public class MatchInfoController {

	private final MatchBoardInfoService matchInfoService;
	
	//매치 글쓰기 인서트
	@PostMapping("/match-infos")
	public int insertMatchBoardInfo(MatchBoardInfoVO match) {
		log.info("match => {}", match);
		return matchInfoService.insertMatchInfo(match);
	}
	
	//매치 상세뷰 정보 불러오기
	@GetMapping("/match-view/{mbNum}")
	public ResponseEntity<MatchBoardInfoVO> selectMatchBoardInfo(@PathVariable int mbNum) {
		log.info("mbNum => {}", mbNum);
		MatchBoardInfoVO matchInfo = matchInfoService.selectMatchInfo(mbNum);
		return ResponseEntity.ok(matchInfo);
	}

	//매치 목록 불러오기
	@GetMapping("/match-board")
	public ResponseEntity<MatchBoardInfoListVO> getMatchList() {
		MatchBoardInfoListVO matchBoardInfoListVO = matchInfoService.selectMatchList();
		return ResponseEntity.ok(matchBoardInfoListVO);
	}
	
	//특정 팀 매치 목록 불러오기
	@GetMapping("/match-infos") 
	public PageInfo<MatchBoardInfoVO> selectMatchInfosByTaNum(MatchBoardInfoVO matchBoardInfoVO){
		log.info("taNum=>{}", matchBoardInfoVO);
			return matchInfoService.selectMatchInfosByTaNum(matchBoardInfoVO);
		}
	}