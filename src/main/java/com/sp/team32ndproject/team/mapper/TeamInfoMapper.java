package com.sp.team32ndproject.team.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.sp.team32ndproject.team.vo.TeamInfoVO;
import com.sp.team32ndproject.user.vo.UserInfoVO;

@Mapper
public interface TeamInfoMapper {
	int insertTeamInfo(TeamInfoVO team);
	TeamInfoVO selectTeamInfoByTaName(String taName);
	TeamInfoVO selectTeamInfoByTaTypeAndTaNum (TeamInfoVO teamInfoVO);
	////////////////////////////////////////////////////////////
	
	TeamInfoVO selectTaTypeMatchBoardInfoByTaNum(int taNum);
	List<TeamInfoVO> selectTeamInfos(TeamInfoVO team);
	//team-ranks.html ,team-setting.html
	List<TeamInfoVO> selectTeamInfo(TeamInfoVO teamInfoVO);
	List<TeamInfoVO> selectTeamInfosByUiNum(int uiNum);
	
	//team-members.html
	TeamInfoVO selectAdminByUiNumAndTaNum(@Param("uiNum") int uiNum,@Param("taNum") int taNum);
	
	//team-setting.html //team-profile.js
	TeamInfoVO selectTeamInfoByTaNum(int taNum);
	List<TeamInfoVO> selectTeamInfosByUiNumAndTaType(TeamInfoVO teamInfoVO);
	List<TeamInfoVO> selectTeamRankByTeamType(TeamInfoVO teamInfoVO);
    List<TeamInfoVO> selectTeamUserInfo(int uiNum);
    
  //team-setting.html
    int updateTeamInfo(TeamInfoVO teamInfoVO);
    int updateTeamInfoToHomeMatchResult(TeamInfoVO teamInfoVO);
    int updateTeamInfoToAwayMatchResult(TeamInfoVO teamInfoVO);
	TeamInfoVO selectTeamByTaNum(int taNum);
	
	//team-members.html
	int updateTeamTaActiveStatusInfo(TeamInfoVO teamInfoVO);

}
