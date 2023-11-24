package com.sp.team32ndproject.team.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.sp.team32ndproject.team.service.TeamInfoService;
import com.sp.team32ndproject.team.vo.TeamInfoVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
public class TeamInfoController {
	
	private final TeamInfoService teamInfoService;
	
	@PostMapping("/team-add")
	public int insertTeamInfo(TeamInfoVO team, @AuthenticationPrincipal int uiNum) {
		team.setUiNum(uiNum);
		log.info("team => {}", team);
		return teamInfoService.insertTeamInfo(team);
	}
	
	@GetMapping("/team-infos")
	public List<TeamInfoVO>  selectTeamInfos(TeamInfoVO team) {
		return teamInfoService.selectTeamInfos(team);
	}
}
