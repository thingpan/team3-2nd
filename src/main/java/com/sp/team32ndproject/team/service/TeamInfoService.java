package com.sp.team32ndproject.team.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.sp.team32ndproject.match.vo.MatchResultVO;
import com.sp.team32ndproject.team.mapper.TeamInfoMapper;
import com.sp.team32ndproject.team.mapper.TeamSignUserInfoMapper;
import com.sp.team32ndproject.team.vo.MsgVO;
import com.sp.team32ndproject.team.vo.TeamInfoVO;
import com.sp.team32ndproject.team.vo.TeamUserInfoVO;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class TeamInfoService {

    @Autowired
    private AmazonS3 amazonS3;

    @Value("${upload.file-path}")
    private String uploadFilePath;

    @Value("${bucket.file-Path}")
    private String s3FilePath;

    private final TeamInfoMapper teamInfoMapper;
    private final TeamUserInfoService teamUserInfoService;
    private final TeamSignUserInfoMapper teamSignUserInfoMapper;

    public int insertTeamInfo(TeamInfoVO team, UserInfoVO user) {
        team.setUiNum(user.getUiNum());

        if (team.getTaFile() != null) {
            MultipartFile file = team.getTaFile();
            String originFileName = file.getOriginalFilename();
            String extName = originFileName.substring(originFileName.lastIndexOf("."));
            String fileName = UUID.randomUUID() + extName;
            team.setTaFileName(originFileName);
            try {            
                InputStream inputStream = file.getInputStream();
                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentType(file.getContentType());
                metadata.setContentLength(file.getSize());
                String s3Key = "upload/" + fileName;
                amazonS3.putObject("3nd-team3", s3Key, inputStream, metadata);
                team.setTaFilePath("https://3nd-team3.s3.ap-northeast-2.amazonaws.com/" + s3Key);
            } catch (IOException e) {
                log.error("Failed to upload file to S3: {}", e.getMessage());
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
            try {
                InputStream inputStream = file.getInputStream();
                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentType(file.getContentType());
                metadata.setContentLength(file.getSize());
                String s3Key = "upload/" + fileName;
                amazonS3.putObject("3nd-team3", s3Key, inputStream, metadata);
                teamInfoVO.setTaFilePath("https://3nd-team3.s3.ap-northeast-2.amazonaws.com/" + s3Key);
            } catch (IOException e) {
                log.error("File upload error: {}", e.getMessage());
                throw new RuntimeException("File upload error", e); 
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
		if (teamSignUserInfoMapper.selectTeamSignUserInfoByUiNumAndTaNum(user.getUiNum(), taNum) != null) {
			teamInfoVO.setTaSignStatus("1");
		} else {
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
		} else {
			msgVO.setResultMsg("1");
		}
		return msgVO;
	}

	// 여기 매너포인트 수정
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
			teamInfoVO.setTaDrawCnt(matchDrawCntResult);
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
			teamInfoVO.setTaDrawCnt(matchDrawCntResult);
		}
		teamInfoMapper.updateTeamInfoToAwayMatchResult(teamInfoVO);
	}

	public List<TeamInfoVO> selectTeamRank(TeamInfoVO teamInfoVO) {
		return teamInfoMapper.selectTeamInfo(teamInfoVO);
	}

}
