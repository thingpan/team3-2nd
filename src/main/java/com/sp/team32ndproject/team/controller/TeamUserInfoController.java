package com.sp.team32ndproject.team.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.github.pagehelper.PageInfo;
import com.sp.team32ndproject.team.mapper.TeamUserInfoMapper;
import com.sp.team32ndproject.team.service.TeamUserInfoService;
import com.sp.team32ndproject.team.vo.TeamInfoVO;
import com.sp.team32ndproject.team.vo.TeamSignUserInfoVO;
import com.sp.team32ndproject.team.vo.TeamUserInfoVO;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class TeamUserInfoController {
	
	private final TeamUserInfoService teamUserInfoService;
	
	@PostMapping("/team-user-add")
	public int insertTeamUserInfo(@RequestBody TeamSignUserInfoVO teamSignUserInfoVO) {
		return teamUserInfoService.insertTeamUserInfoToUser(teamSignUserInfoVO); 
	}
	
	@GetMapping("/team-users/helper")
	public PageInfo<TeamUserInfoVO> selectTeamUserInfosWithHelper(TeamUserInfoVO teamUserInfoVO){
		return teamUserInfoService.selectTeamUserInfosWithHelper(teamUserInfoVO);
	}
	@GetMapping("/team-user")
	public PageInfo<TeamUserInfoVO> selectTeamUserInfos(TeamUserInfoVO teamUserInfoVO){
		return teamUserInfoService.selectTeamUserInfosWithHelper(teamUserInfoVO);
	}
	
	@DeleteMapping("team-user-delete")
	public int deleteTeamUserInfo(@RequestBody TeamUserInfoVO teamUserInfoVO) {
		return teamUserInfoService.deleteTeamUserInfo(teamUserInfoVO);
	}
	
	
	
}
