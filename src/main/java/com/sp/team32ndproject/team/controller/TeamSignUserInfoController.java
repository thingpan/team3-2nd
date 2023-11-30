package com.sp.team32ndproject.team.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.sp.team32ndproject.team.service.TeamSignUserInfoService;
import com.sp.team32ndproject.team.vo.TeamInfoVO;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
public class TeamSignUserInfoController {
	
	private final TeamSignUserInfoService teamSignUserInfoService;
	
	@PostMapping("/team-sign-user-add")
	public int insertTeamSignUserInfo(@RequestBody TeamInfoVO team, @AuthenticationPrincipal UserInfoVO user) {
		log.info("team=>{}", team); 
		log.info("user=>{}", user);
		return teamSignUserInfoService.insertTeamSignUserInfo(team, user);
	}
	
}
