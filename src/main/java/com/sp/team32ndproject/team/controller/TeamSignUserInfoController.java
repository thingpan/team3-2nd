package com.sp.team32ndproject.team.controller;

import org.apache.ibatis.annotations.Delete;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.github.pagehelper.PageInfo;
import com.sp.team32ndproject.team.service.TeamSignUserInfoService;
import com.sp.team32ndproject.team.vo.TeamInfoVO;
import com.sp.team32ndproject.team.vo.TeamSignUserInfoVO;
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
	
	@GetMapping("/team-sign-users/helper")
	public PageInfo<TeamSignUserInfoVO> selectTeamSignUserInfosWithHelper(TeamSignUserInfoVO teamSignUserInfoVO){
		return teamSignUserInfoService.selectTeamSignUserInfosWithHelper(teamSignUserInfoVO);
	}
	
	@DeleteMapping("/team-sign-user-delete")
	public int deleteTeamSignUserInfo(@RequestBody TeamSignUserInfoVO teamSignUserInfoVO) {
		log.info("teamData => {}",teamSignUserInfoVO);
		return teamSignUserInfoService.deleteTeamSignUserInfo(teamSignUserInfoVO);
	}
	
}
