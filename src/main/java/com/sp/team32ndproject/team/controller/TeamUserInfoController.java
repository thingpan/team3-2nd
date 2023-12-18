package com.sp.team32ndproject.team.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.pagehelper.PageInfo;
import com.sp.team32ndproject.team.service.TeamUserInfoService;
import com.sp.team32ndproject.team.vo.MsgVO;
import com.sp.team32ndproject.team.vo.TeamSignUserInfoVO;
import com.sp.team32ndproject.team.vo.TeamUserInfoVO;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
public class TeamUserInfoController {

	private final TeamUserInfoService teamUserInfoService;

	@PostMapping("/team-user-add")
	public int insertTeamUserInfo(@RequestBody TeamSignUserInfoVO teamSignUserInfoVO) {
		return teamUserInfoService.insertTeamUserInfoToUser(teamSignUserInfoVO);
	}

	@GetMapping("/team-users/helper")
	public PageInfo<TeamUserInfoVO> selectTeamUserInfosWithHelper(TeamUserInfoVO teamUserInfoVO) {
		return teamUserInfoService.selectTeamUserInfosWithHelper(teamUserInfoVO);
	}

	@GetMapping("/team-user")
	public PageInfo<TeamUserInfoVO> selectTeamUserInfos(TeamUserInfoVO teamUserInfoVO) {
		return teamUserInfoService.selectTeamUserInfosWithHelper(teamUserInfoVO);
	}

	@DeleteMapping("/team-infos")
	public MsgVO deleteTeamUserInfo(@RequestParam int tuNum, @RequestParam int taNum, @AuthenticationPrincipal UserInfoVO user) {
		log.info("data param=>{}",taNum);
		log.info("data param2 => {}", tuNum);
		return teamUserInfoService.deleteTeamUserInfo(tuNum, taNum, user.getUiNum());
	}

}
