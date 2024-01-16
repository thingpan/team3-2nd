package com.sp.team32ndproject.team.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.pagehelper.PageInfo;
import com.sp.team32ndproject.team.service.TeamUserInfoService;
import com.sp.team32ndproject.team.vo.MsgVO;
import com.sp.team32ndproject.team.vo.TeamInfoVO;
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

	// 가입신청 수락 컨트롤러
	@PostMapping("/team-user-add")
	public int insertTeamUserInfo(@RequestBody TeamSignUserInfoVO teamSignUserInfoVO) {
		return teamUserInfoService.insertTeamUserInfoToUser(teamSignUserInfoVO);
	}

	// 팀원 목록 헬퍼를 통해 가져오기
	@GetMapping("/auth/team-user-infos/helper")
	public PageInfo<TeamUserInfoVO> selectTeamUserInfosWithHelper(TeamUserInfoVO teamUserInfoVO) {
		return teamUserInfoService.selectTeamUserInfosWithHelper(teamUserInfoVO);
	}

//	@GetMapping("/team-user-infos/{taNum}")
//	public int getTeamUserInfos(@PathVariable int taNum, @AuthenticationPrincipal UserInfoVO user) {
//		return teamUserInfoService.getTeamUserInfos(taNum, user);
//	}

	// 팀원 방출
	@DeleteMapping("/team-infos")
	public MsgVO deleteTeamUserInfo(@RequestParam int tuNum, @RequestParam int taNum,
			@AuthenticationPrincipal UserInfoVO user) {
		log.info("data param=>{}", taNum);
		log.info("data param2 => {}", tuNum);
		return teamUserInfoService.deleteTeamUserInfo(tuNum, taNum, user.getUiNum());
	}

	// 팀 탈퇴
	@DeleteMapping("/team-user-delete")
	public MsgVO deleteTeamUser(@RequestParam int uiNum, @RequestParam int taNum, @RequestParam String tuRole) {
		TeamUserInfoVO teamUserInfo = new TeamUserInfoVO();
		teamUserInfo.setUiNum(uiNum);
		teamUserInfo.setTaNum(taNum);
		teamUserInfo.setTuRole(tuRole);

		return teamUserInfoService.deleteTeamUser(taNum,teamUserInfo);
	}

	// 팀에 속해있는 내가 유저인지 어드민지 확인
	@GetMapping("/get-user-role")
	public TeamUserInfoVO TeamUserRole(@RequestParam int taNum,@AuthenticationPrincipal UserInfoVO user) {
		TeamUserInfoVO teamUserInfo = new TeamUserInfoVO();
		teamUserInfo.setUiNum(user.getUiNum());
		teamUserInfo.setTaNum(taNum);

		return teamUserInfoService.TeamUserRole(teamUserInfo,user);
	}
	

}
