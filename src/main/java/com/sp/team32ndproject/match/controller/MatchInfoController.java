package com.sp.team32ndproject.match.controller;

import java.io.IOException;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sp.team32ndproject.match.service.MatchInfoService;
import com.sp.team32ndproject.match.vo.MatchInfoVO;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
public class MatchInfoController {
	
	private final MatchInfoService matchInfoService;
	
	@PostMapping("/match-add")
	@ResponseBody
	public MatchInfoVO insertMatchInfo(MatchInfoVO match, @AuthenticationPrincipal UserInfoVO user) throws IllegalStateException, IOException {
		log.info("match =>{}", match);
		log.info("user =>{}", user);
		return matchInfoService.insertMatchInfo(match);  
	}
}
