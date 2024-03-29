package com.sp.team32ndproject.team.controller;

import java.util.Comparator;
import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
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
	//mypage.html
	@PostMapping("/team-infos")
	public int insertTeamInfo(TeamInfoVO team, @AuthenticationPrincipal UserInfoVO user) {
		log.info("user => {}", user);
		log.info("team => {}", team);
		return teamInfoService.insertTeamInfo(team, user);
	}

	// 팀 랭크 
	@GetMapping("/team-infos")//team-ranks.html ,team-setting.html
	public List<TeamInfoVO> selectTeamRank(@ModelAttribute TeamInfoVO teamInfoVO) {
		return teamInfoService.selectTeamRank(teamInfoVO);
	}

	// 팀 정보 가져오기
	@GetMapping("/auth/team-infos/{taNum}")//team-setting.html //team-profile.js
	public TeamInfoVO selectTeamInfoByTaNum(@PathVariable int taNum, @AuthenticationPrincipal UserInfoVO user) {
		log.info("taNum =>{}", taNum);
		return teamInfoService.selectTeamInfoByTaNum(taNum, user);
	}

	// 내가 속한 팀 가져오기
	@GetMapping("/auth/team-infos")
	public List<TeamInfoVO> selectTeamUserInfo(@AuthenticationPrincipal UserInfoVO user) {
		log.info("uiNum => {}", user);
		return teamInfoService.selectTeamUserInfo(user.getUiNum());

	}

	// 어드민 내가 속한 팀 가져오기
	@GetMapping("/auth/team-infos/admin")
	public List<TeamInfoVO> selectTeamInfosByUiNum(@AuthenticationPrincipal UserInfoVO user) {
		return teamInfoService.selectTeamInfosByUiNum(user.getUiNum());
	}

	// 팀 정보 수정 
	@PutMapping("/auth/team-infos") //team-setting.html
	public int updateTeamInfo(TeamInfoVO teamInfoVO) {
		log.info("teamInfo => {}", teamInfoVO);
		return teamInfoService.updateTeamInfo(teamInfoVO);
	}

	// 매치 신청 할때 매치글과 같은 타입으로 나의 팀 불러오기
	@GetMapping("/auth/team-infos/admin/{taType}")
	public List<TeamInfoVO> selectTeamInfosByUiNumAndTaType(@PathVariable String taType,
			@AuthenticationPrincipal UserInfoVO user) {
		log.info("taType => {}", taType);
		log.info("user => {}", user);

		return teamInfoService.selectTeamInfosByUiNumAndTaType(taType, user.getUiNum());
	}

	//////////////////

//	// 종목별 팀 순위
//	@GetMapping("/team-infos/{taType}")
//	public List<TeamInfoVO> selectTeamRankByTeamType(@PathVariable String taType) {
//		log.info("taType => {}", taType);
//		return teamInfoService.selectTeamRankByTeamType(taType);
//	}

}
