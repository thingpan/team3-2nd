package com.sp.team32ndproject.team.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sp.team32ndproject.team.vo.TeamSignUserInfoVO;

@Mapper
public interface TeamSignUserInfoMapper {
	int insertTeamSignUserInfo(TeamSignUserInfoVO teamSignUserInfoVO);
	
	//teamapply.js
	List<TeamSignUserInfoVO> selectTeamSignUserInfosWithHelper(TeamSignUserInfoVO teamSignUserInfoVO);
	
	//team-setting.html
	TeamSignUserInfoVO selectTeamSignUserInfoByUiNumAndTaNum(@Param("uiNum") int uiNum,@Param("taNum") int taNum);
	
	//team-apply.js
	int deleteTeamSignUserInfo(TeamSignUserInfoVO teamSignUserInfoVO);
	int deleteTeamSignUserInfoByUiNum(int uiNum);
	
}
