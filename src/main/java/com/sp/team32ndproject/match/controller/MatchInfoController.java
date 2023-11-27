package com.sp.team32ndproject.match.controller;

import java.io.IOException;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
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
}
