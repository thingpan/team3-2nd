package com.sp.team32ndproject.team.controller;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
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

	@GetMapping("/my-team-infos")
	public List<TeamInfoVO> selectTeamInfosByUiNum(@AuthenticationPrincipal UserInfoVO user) {
		return teamInfoService.selectTeamInfosByUiNum(user.getUiNum());
	}

	// 팀 랭크
	@GetMapping("/team-infos/rank")
	public List<TeamInfoVO> selectTeamRank(TeamInfoVO team) {
		List<TeamInfoVO> teamInfos = teamInfoService.selectTeamInfos(team);
		teamInfos.sort(Comparator.comparingInt(TeamInfoVO::getTaPoint).reversed());
		return teamInfos;
	}

	@GetMapping("/team-info")
	public TeamInfoVO selectTeamInfoByTaNum(@RequestParam int taNum) {
		return teamInfoService.selectTeamInfoByTaNum(taNum);
	}

	@GetMapping("/my-team-infos-by-type/{taType}")
	public List<TeamInfoVO> selectTeamInfosByUiNumAndTaType(@PathVariable String taType,
			@AuthenticationPrincipal UserInfoVO user) {
		log.info("taType => {}", taType);
		log.info("user => {}", user);

		return teamInfoService.selectTeamInfosByUiNumAndTaType(taType, user.getUiNum());
	}

	@PostMapping("/check-taName")
	public TeamInfoVO TeamInfoByTaName(@RequestBody TeamInfoVO team) {
		return teamInfoService.selectTeamInfoByTaName(team);
	}

	@GetMapping("/team-user-info")
	public List<TeamInfoVO> selectTeamUserInfo(@AuthenticationPrincipal UserInfoVO user) {
		log.info("uiNum => {}", user);
		return teamInfoService.selectTeamUserInfo(user.getUiNum());

	}

}
