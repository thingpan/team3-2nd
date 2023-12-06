package com.sp.team32ndproject.team.controller;

import java.util.Comparator;
import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sp.team32ndproject.team.service.TeamInfoService;
import com.sp.team32ndproject.team.vo.TeamInfoVO;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
public class TeamInfoController {

	private final TeamInfoService teamInfoService;

	// 팀추가
	@PostMapping("/team-add")
	public int insertTeamInfo(TeamInfoVO team, @AuthenticationPrincipal UserInfoVO user) {
		log.info("user => {}", user);
		log.info("team => {}", team);
		return teamInfoService.insertTeamInfo(team, user);
	}

	// 팀 목록
	@GetMapping("/team-infos")
	public List<TeamInfoVO> selectTeamInfos(TeamInfoVO team) {
		return teamInfoService.selectTeamInfos(team);
	}

	// 팀 랭크
	@GetMapping("/team-infos/rank")
	public List<TeamInfoVO> selectTeamRank(TeamInfoVO team) {
		List<TeamInfoVO> teamInfos = teamInfoService.selectTeamInfos(team);
		teamInfos.sort(Comparator.comparingInt(TeamInfoVO::getTaPoint).reversed());
		return teamInfos;
	}
	@GetMapping("/user-infos")
	public UserInfoVO selectTaTypeMatchBoardInfoByUiNum(@AuthenticationPrincipal UserInfoVO user) {
		return teamInfoService.selectTaTypeMatchBoardInfoByUiNum(user);
	}
}
