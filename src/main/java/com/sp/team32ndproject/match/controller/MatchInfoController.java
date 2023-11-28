package com.sp.team32ndproject.match.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
	public int insertMatchBoardInfo(MatchBoardInfoVO match) {
		log.info("match => {}", match);
		return matchInfoService.insertMatchInfo(match);
	}

	@GetMapping("/match-board/{mbNum}")
	@ResponseBody
	public List<MatchBoardInfoVO> selectMatchBoardInfo(@PathVariable int mbNum) {
		return matchInfoService.selectMatchInfo(mbNum);
	}
}
