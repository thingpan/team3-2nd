package com.sp.team32ndproject.team.service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sp.team32ndproject.common.util.StringUtils;
import com.sp.team32ndproject.team.mapper.TeamInfoMapper;
import com.sp.team32ndproject.team.vo.TeamInfoVO;
import com.sp.team32ndproject.team.vo.TeamUserInfoVO;
import com.sp.team32ndproject.user.mapper.UserInfoMapper;

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

	public int insertTeamInfo(TeamInfoVO team) {
		MultipartFile file = team.getTaFile();
		String originFileName = team.getTaFile().getOriginalFilename();
		String extName = originFileName.substring(originFileName.lastIndexOf("."));
		String fileName = UUID.randomUUID() + extName;
		team.setTaFileName(originFileName);
		team.setTaFilePath("/file/"+fileName);
		try {
			file.transferTo(new File(uploadFilePath + fileName));
		} catch (IllegalStateException e) {
			log.error("file upload error=>{}", e);
		} catch (IOException e) {
			log.error("file upload error=>{}", e);
		}
		if(1 == teamInfoMapper.insertTeamInfo(team)) {
			TeamUserInfoVO teamUser = new TeamUserInfoVO();
			teamUser.setTaNum(team.getTaNum());
			teamUser.setUiNum(team.getUiNum());
			teamUser.setTuRole("ADMIN");
			return teamUserInfoService.insertUserInfo(teamUser);
		}
		return 0;
	}

	public List<TeamInfoVO> selectTeamInfos(TeamInfoVO team) {
		return teamInfoMapper.selectTeamInfos(team);
	}
}
