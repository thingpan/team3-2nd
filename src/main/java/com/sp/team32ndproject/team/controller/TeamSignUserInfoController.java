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
import com.sp.team32ndproject.team.vo.MsgVO;
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
	
	//가입신청 인서트 컨트롤러
	@PostMapping("/auth/team-sign-infos") //team-profile.js
	public MsgVO insertTeamSignUserInfo(@RequestBody TeamInfoVO team, @AuthenticationPrincipal UserInfoVO user) {
		log.info("team=>{}", team); 
		log.info("user=>{}", user);
		return teamSignUserInfoService.insertTeamSignUserInfo(team, user);
	}
	
	//가입신청 목록 페이징헬퍼를 통해 가져오기 
	@GetMapping("/auth/team-sign-infos/helper")//team-apply.js
	public PageInfo<TeamSignUserInfoVO> selectTeamSignUserInfosWithHelper(TeamSignUserInfoVO teamSignUserInfoVO){
		return teamSignUserInfoService.selectTeamSignUserInfosWithHelper(teamSignUserInfoVO);
	}
	
	//가입신청 거절 컨트롤러
	@DeleteMapping("/auth/team-sign-infos")//team-apply.js
	public int deleteTeamSignUserInfo(@RequestBody TeamSignUserInfoVO teamSignUserInfoVO) {
		log.info("teamData => {}",teamSignUserInfoVO);
		return teamSignUserInfoService.deleteTeamSignUserInfo(teamSignUserInfoVO);
	}
	
}
