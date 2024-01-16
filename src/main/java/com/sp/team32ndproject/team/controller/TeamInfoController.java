package com.sp.team32ndproject.team.controller;

import java.util.Comparator;
import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sp.team32ndproject.team.service.TeamInfoService;
import com.sp.team32ndproject.team.vo.MsgVO;
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
	@PostMapping("/team-infos")
	public int insertTeamInfo(TeamInfoVO team, @AuthenticationPrincipal UserInfoVO user) {
		log.info("user => {}", user);
		log.info("team => {}", team);
		return teamInfoService.insertTeamInfo(team, user);
	}

	// 내가 속한 팀 가져오기
	@GetMapping("/my-team-infos")
	public List<TeamInfoVO> selectTeamInfosByUiNum(@AuthenticationPrincipal UserInfoVO user) {
		return teamInfoService.selectTeamInfosByUiNum(user.getUiNum());
	}

	// 팀 랭크
	@GetMapping("/team-infos")
	public List<TeamInfoVO> selectTeamRank(@RequestParam(value = "taType", required = false) String taType,
			@RequestParam(value = "taBoundarySido", required = false) String taBoundarySido,
			@RequestParam(value = "taPoint", required = false) Integer taPoint) {
		return teamInfoService.selectTeamRank(taType, taBoundarySido, taPoint);
	}

	// 종목별 팀 순위
	@GetMapping("/team-infos/{taType}")
	public List<TeamInfoVO> selectTeamRankByTeamType(@PathVariable String taType) {
		log.info("taType => {}", taType);
		return teamInfoService.selectTeamRankByTeamType(taType);
	}

	// 팀 정보 가져오기
	@GetMapping("/team-info")
	public TeamInfoVO selectTeamInfoByTaNum(@RequestParam int taNum, @AuthenticationPrincipal UserInfoVO user) {
		log.info("taNum =>{}" ,taNum);
		return teamInfoService.selectTeamInfoByTaNum(taNum, user); 
	}

	// 매치 신청 할때 매치글과 같은 타입으로 나의 팀 불러오기
	@GetMapping("/my-team-infos-by-type/{taType}")
	public List<TeamInfoVO> selectTeamInfosByUiNumAndTaType(@PathVariable String taType,
			@AuthenticationPrincipal UserInfoVO user) {
		log.info("taType => {}", taType);
		log.info("user => {}", user);

		return teamInfoService.selectTeamInfosByUiNumAndTaType(taType, user.getUiNum());
	}

	// 팀이름 중복검사
	@GetMapping("/check-team-name/{taName}")
	public MsgVO TeamInfoByTaName(@PathVariable String taName) {
		return teamInfoService.selectTeamInfoByTaName(taName);
	}

	// 내가 속한 팀 가져오기
	@GetMapping("/team-user-info")
	public List<TeamInfoVO> selectTeamUserInfo(@AuthenticationPrincipal UserInfoVO user) {
		log.info("uiNum => {}", user);
		return teamInfoService.selectTeamUserInfo(user.getUiNum());

	}

	// 팀 정보 수정
	@PutMapping("/team-info-update")
	public int updateTeamInfo(TeamInfoVO teamInfoVO) {
		log.info("teamInfo => {}", teamInfoVO);
		return teamInfoService.updateTeamInfo(teamInfoVO);
	}
}
