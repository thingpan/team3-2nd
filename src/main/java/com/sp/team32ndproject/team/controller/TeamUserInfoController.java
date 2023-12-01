package com.sp.team32ndproject.team.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sp.team32ndproject.team.service.TeamUserInfoService;
import com.sp.team32ndproject.team.vo.TeamInfoVO;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class TeamUserInfoController {
	
	private final TeamUserInfoService teamUserInfoService;
	
	@PostMapping("/team-user-add")
	public int insertTeamUserInfo(TeamInfoVO team, @AuthenticationPrincipal UserInfoVO user) {
		return teamUserInfoService.insertTeamUserInfo(team, user); 
	}
	
}
