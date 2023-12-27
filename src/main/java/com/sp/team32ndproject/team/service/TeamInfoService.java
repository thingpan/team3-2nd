package com.sp.team32ndproject.team.service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sp.team32ndproject.common.util.StringUtils;
import com.sp.team32ndproject.match.vo.MatchResultVO;
import com.sp.team32ndproject.team.mapper.TeamInfoMapper;
import com.sp.team32ndproject.team.mapper.TeamSignUserInfoMapper;
import com.sp.team32ndproject.team.vo.MsgVO;
import com.sp.team32ndproject.team.vo.TeamInfoVO;
import com.sp.team32ndproject.team.vo.TeamUserInfoVO;
import com.sp.team32ndproject.user.mapper.UserInfoMapper;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class TeamInfoService {

	private final TeamInfoMapper teamInfoMapper;
	private final TeamUserInfoService teamUserInfoService;
	@Value("${upload.file-path}")
	private String uploadFilePath;
	private final TeamSignUserInfoMapper teamSignUserInfoMapper;

	public int insertTeamInfo(TeamInfoVO team, UserInfoVO user) {
		team.setUiNum(user.getUiNum());
		if (team.getTaFile() != null) {
			MultipartFile file = team.getTaFile();
			String originFileName = team.getTaFile().getOriginalFilename();
			String extName = originFileName.substring(originFileName.lastIndexOf("."));
			String fileName = UUID.randomUUID() + extName;
			team.setTaFileName(originFileName);
			team.setTaFilePath("/file/" + fileName);
			try {
				file.transferTo(new File(uploadFilePath + fileName));
			} catch (IllegalStateException e) {
				log.error("file upload error=>{}", e);
			} catch (IOException e) {
				log.error("file upload error=>{}", e);
			}
		}
		if (1 == teamInfoMapper.insertTeamInfo(team)) {
			TeamUserInfoVO teamUserInfoVO = new TeamUserInfoVO();
			teamUserInfoVO.setTaNum(team.getTaNum());
			teamUserInfoVO.setUiNum(user.getUiNum());
			teamUserInfoVO.setTuRole("ADMIN");
			return teamUserInfoService.insertTeamUserInfo(teamUserInfoVO);
		}
		return 0;
	}

	public int updateTeamInfo(TeamInfoVO teamInfoVO) {
		if (teamInfoVO.getTaFile() != null) {
			MultipartFile file = teamInfoVO.getTaFile();
			String originFileName = teamInfoVO.getTaFile().getOriginalFilename();
			String extName = originFileName.substring(originFileName.lastIndexOf("."));
			String fileName = UUID.randomUUID() + extName;
			teamInfoVO.setTaFileName(originFileName);
			teamInfoVO.setTaFilePath("/file/" + fileName);
			try {
				file.transferTo(new File(uploadFilePath + fileName));
			} catch (IllegalStateException e) {
				log.error("file upload error=>{}", e);
			} catch (IOException e) {
				log.error("file upload error=>{}", e);
			}
		}
		return teamInfoMapper.updateTeamInfo(teamInfoVO);
	}

	public List<TeamInfoVO> selectTeamInfos(TeamInfoVO team) {
		return teamInfoMapper.selectTeamInfos(team);
	}

	public List<TeamInfoVO> selectTeamInfosByUiNum(int uiNum) {
		return teamInfoMapper.selectTeamInfosByUiNum(uiNum);
	}

	public TeamInfoVO selectAdminByUiNumAndTaNum(int uiNum, int taNum) {
		return teamInfoMapper.selectAdminByUiNumAndTaNum(uiNum, taNum);
	}

	public TeamInfoVO selectTeamInfoByTaNum(int taNum, UserInfoVO user) {
		TeamInfoVO teamInfoVO = new TeamInfoVO();
		teamInfoVO = teamInfoMapper.selectTeamInfoByTaNum(taNum);
		if(teamSignUserInfoMapper.selectTeamSignUserInfoByUiNumAndTaNum(user.getUiNum(), taNum) != null) {
			teamInfoVO.setTaSignStatus("1");
		}else {
			teamInfoVO.setTaSignStatus("0");
		}
		return teamInfoVO;
	}

	public List<TeamInfoVO> selectTeamInfosByUiNumAndTaType(String taType, int uiNum) {
		TeamInfoVO teamInfoVO = new TeamInfoVO();
		teamInfoVO.setTaType(taType);
		teamInfoVO.setUiNum(uiNum);
		return teamInfoMapper.selectTeamInfosByUiNumAndTaType(teamInfoVO);
	}

	public List<TeamInfoVO> selectTeamRankByTeamType(String taType) {
		TeamInfoVO teamInfoVO = new TeamInfoVO();
		teamInfoVO.setTaType(taType);
		return teamInfoMapper.selectTeamRankByTeamType(teamInfoVO);
	}

	public List<TeamInfoVO> selectTeamUserInfo(int uiNum) {
		return teamInfoMapper.selectTeamUserInfo(uiNum);
	}

	public MsgVO selectTeamInfoByTaName(String taName) {
		MsgVO msgVO = new MsgVO();
		if (teamInfoMapper.selectTeamInfoByTaName(taName) != null) {
			msgVO.setResultMsg("0");
			
		}else {
			msgVO.setResultMsg("1");
		}
		return msgVO;
	}
	//여기 매너포인트 수정
	public void doUpdateHomeMatchResult(MatchResultVO matchResultVO) {
		log.info("matchResultVO => {}", matchResultVO);
		TeamInfoVO teamInfoVO = teamInfoMapper.selectTeamInfoByTaNum(matchResultVO.getTaHomeNum());
		if (matchResultVO.getMrHomeScore() > matchResultVO.getMrAwayScore()) {
			int pointResult = teamInfoVO.getTaPoint() + 3;
			int matchCntResult = teamInfoVO.getTaMatchCount() + 1;
			int matchWinCntResult = teamInfoVO.getTaWinCnt() + 1;
			int matchMannerPoint = teamInfoVO.getTaMannerPoint() + matchResultVO.getMrHomeMannerPoint();
			teamInfoVO.setTaPoint(pointResult);
			teamInfoVO.setTaMannerPoint(matchMannerPoint);
			teamInfoVO.setTaMatchCount(matchCntResult);
			teamInfoVO.setTaWinCnt(matchWinCntResult);
		} else if (matchResultVO.getMrHomeScore() < matchResultVO.getMrAwayScore()) {
			int pointResult = 0;
			if (teamInfoVO.getTaPoint() > 3) {
				pointResult = teamInfoVO.getTaPoint() - 3;
			}
			int matchCntResult = teamInfoVO.getTaMatchCount() + 1;
			int matchLooseCntResult = teamInfoVO.getTaLooseCnt() + 1;
			int matchMannerPoint = teamInfoVO.getTaMannerPoint() + matchResultVO.getMrHomeMannerPoint();
			teamInfoVO.setTaPoint(pointResult);
			teamInfoVO.setTaMannerPoint(matchMannerPoint);
			teamInfoVO.setTaMatchCount(matchCntResult);
			teamInfoVO.setTaLooseCnt(matchLooseCntResult);
		} else if (matchResultVO.getMrHomeScore() == matchResultVO.getMrAwayScore()) {
			int matchCntResult = teamInfoVO.getTaMatchCount() + 1;
			int matchDrawCntResult = teamInfoVO.getTaDrawCnt() + 1;
			int matchMannerPoint = teamInfoVO.getTaMannerPoint() + matchResultVO.getMrHomeMannerPoint();
			teamInfoVO.setTaMannerPoint(matchMannerPoint);
			teamInfoVO.setTaMatchCount(matchCntResult);
			teamInfoVO.setTaLooseCnt(matchDrawCntResult);
		}
		teamInfoMapper.updateTeamInfoToHomeMatchResult(teamInfoVO);
	}

	public void doUpdateAwayMatchResult(MatchResultVO matchResultVO) {
		TeamInfoVO teamInfoVO = teamInfoMapper.selectTeamInfoByTaNum(matchResultVO.getTaAwayNum());
		if (matchResultVO.getMrHomeScore() < matchResultVO.getMrAwayScore()) {
			int pointResult = teamInfoVO.getTaPoint() + 3;
			int matchCntResult = teamInfoVO.getTaMatchCount() + 1;
			int matchWinCntResult = teamInfoVO.getTaWinCnt() + 1;
			int matchMannerPoint = teamInfoVO.getTaMannerPoint() + matchResultVO.getMrAwayMannerPoint();
			teamInfoVO.setTaPoint(pointResult);
			teamInfoVO.setTaMannerPoint(matchMannerPoint);
			teamInfoVO.setTaMatchCount(matchCntResult);
			teamInfoVO.setTaWinCnt(matchWinCntResult);
		} else if (matchResultVO.getMrHomeScore() > matchResultVO.getMrAwayScore()) {
			int pointResult = 0;
			if (teamInfoVO.getTaPoint() > 3) {
				pointResult = teamInfoVO.getTaPoint() - 3;
			}
			int matchCntResult = teamInfoVO.getTaMatchCount() + 1;
			int matchLooseCntResult = teamInfoVO.getTaLooseCnt() + 1;
			int matchMannerPoint = teamInfoVO.getTaMannerPoint() + matchResultVO.getMrAwayMannerPoint();
			teamInfoVO.setTaPoint(pointResult);
			teamInfoVO.setTaMannerPoint(matchMannerPoint);
			teamInfoVO.setTaMatchCount(matchCntResult);
			teamInfoVO.setTaLooseCnt(matchLooseCntResult);
		} else if (matchResultVO.getMrHomeScore() == matchResultVO.getMrAwayScore()) {
			int matchCntResult = teamInfoVO.getTaMatchCount() + 1;
			int matchDrawCntResult = teamInfoVO.getTaDrawCnt() + 1;
			int matchMannerPoint = teamInfoVO.getTaMannerPoint() + matchResultVO.getMrAwayMannerPoint();
			teamInfoVO.setTaMannerPoint(matchMannerPoint);
			teamInfoVO.setTaMatchCount(matchCntResult);
			teamInfoVO.setTaLooseCnt(matchDrawCntResult);
		}
		teamInfoMapper.updateTeamInfoToAwayMatchResult(teamInfoVO);
	}

	public List<TeamInfoVO> selectTeamRank(String taType, String taBoundarySido, Integer taPoint) {
	       return teamInfoMapper.selectTeamRank(taType, taBoundarySido, taPoint);
	}

}
