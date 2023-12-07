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
import org.springframework.web.bind.annotation.ResponseBody;

import com.sp.team32ndproject.match.service.MatchBoardInfoService;
import com.sp.team32ndproject.match.vo.MatchBoardInfoVO;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
public class MatchInfoController {

	private final MatchBoardInfoService matchInfoService;

	@PostMapping("/match-add")
	@ResponseBody
	public int insertMatchBoardInfo(@RequestBody MatchBoardInfoVO match) {
		log.info("match => {}", match);
		return matchInfoService.insertMatchInfo(match);
	}

	@GetMapping("/match-view/{mbNum}")
	public ResponseEntity<MatchBoardInfoVO> selectMatchBoardInfo(@PathVariable int mbNum) {
		log.info("mbNum => {}", mbNum);
		MatchBoardInfoVO matchInfo = matchInfoService.selectMatchInfo(mbNum);
		return ResponseEntity.ok(matchInfo);
	}

	@GetMapping("/match-board")
	public ResponseEntity<MatchBoardInfoListVO> getMatchList() {
		MatchBoardInfoListVO matchBoardInfoListVO = matchInfoService.selectMatchList();
		return ResponseEntity.ok(matchBoardInfoListVO);
	}
}