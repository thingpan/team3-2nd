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
	////////////////////////////////////////////////////////////
	
	TeamInfoVO selectTaTypeMatchBoardInfoByTaNum(int taNum);
	List<TeamInfoVO> selectTeamInfos(TeamInfoVO team);
	 List<TeamInfoVO> selectTeamRank(
	            @Param("taType") String taType,
	            @Param("taBoundarySido") String taBoundarySido,
	            @Param("taPoint") Integer taPoint);
	List<TeamInfoVO> selectTeamInfosByUiNum(int uiNum);
	TeamInfoVO selectAdminByUiNumAndTaNum(@Param("uiNum") int uiNum,@Param("taNum") int taNum);
	TeamInfoVO selectTeamInfoByTaNum(int taNum);
	List<TeamInfoVO> selectTeamInfosByUiNumAndTaType(TeamInfoVO teamInfoVO);
	List<TeamInfoVO> selectTeamRankByTeamType(TeamInfoVO teamInfoVO);
    List<TeamInfoVO> selectTeamUserInfo(int uiNum);
    int updateTeamInfo(TeamInfoVO teamInfoVO);
    int updateTeamInfoToHomeMatchResult(TeamInfoVO teamInfoVO);
    int updateTeamInfoToAwayMatchResult(TeamInfoVO teamInfoVO);
	TeamInfoVO selectTeamByTaNum(int taNum);
	int updateTeamTaActiveStatusInfo(int taNum);

}
