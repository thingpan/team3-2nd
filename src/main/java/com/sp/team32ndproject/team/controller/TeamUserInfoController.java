package com.sp.team32ndproject.team.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
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
	public PageInfo<TeamUserInfoVO> selectTeamUserInfosWithHelper(TeamUserInfoVO teamUserInfoVO) {
		return teamUserInfoService.selectTeamUserInfosWithHelper(teamUserInfoVO);
	}

	@GetMapping("/team-user")
	public PageInfo<TeamUserInfoVO> selectTeamUserInfos(TeamUserInfoVO teamUserInfoVO) {
		return teamUserInfoService.selectTeamUserInfosWithHelper(teamUserInfoVO);
	}

	@DeleteMapping("team-user-delete")
	public int deleteTeamUserInfo(@RequestBody TeamUserInfoVO teamUserInfoVO) {
		return teamUserInfoService.deleteTeamUserInfo(teamUserInfoVO);
	}

	@GetMapping("/team-user-info")
	public TeamUserInfoVO selectTeamUserInfo(@RequestParam int uiNum) {
		try {
			// TeamUserInfoVO 인스턴스를 생성하고 uiNum을 설정합니다.
			TeamInfoVO teamUserInfoVO = new TeamInfoVO();
			teamUserInfoVO.setUiNum(uiNum);

			// 서비스 메서드를 호출하여 팀 사용자 정보를 가져옵니다.
			TeamUserInfoVO result = teamUserInfoService.selectTeamUserInfo(teamUserInfoVO);

			// 결과를 반환합니다.
			return result;
		} catch (Exception e) {
			// 예외를 처리하고 적절한 응답을 반환합니다.
			e.printStackTrace(); // 디버깅을 위해 예외를 로그로 출력합니다.
			return null; // 여기서 오류 응답을 반환하는 것이 좋을 것입니다.
		}
	}
}
