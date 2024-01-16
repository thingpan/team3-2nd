package com.sp.team32ndproject.user.service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.tools.DocumentationTool.Location;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sp.team32ndproject.team.mapper.TeamInfoMapper;
import com.sp.team32ndproject.team.mapper.TeamSignUserInfoMapper;
import com.sp.team32ndproject.team.mapper.TeamUserInfoMapper;
import com.sp.team32ndproject.team.vo.MsgVO;
import com.sp.team32ndproject.team.vo.TeamInfoVO;
import com.sp.team32ndproject.team.vo.TeamUserInfoVO;
import com.sp.team32ndproject.user.controller.UserInfoController;
import com.sp.team32ndproject.user.mapper.UserInfoMapper;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserInfoService implements UserDetailsService {

	private final UserInfoMapper userInfoMapper;
	private final PasswordEncoder passwordEncoder;
	private final TeamSignUserInfoMapper teamSignUserInfoMapper;
	private final TeamUserInfoMapper teamUserInfoMapper;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		UserInfoVO user = userInfoMapper.selectUserInfoByUiId(username);
		if (user == null) {
			throw new UsernameNotFoundException("아이디나 비밀번호가 잘못 되었습니다.");
		}
		return user;
	}

	public int insertUserInfo(UserInfoVO user) {
		user.setUiPwd(passwordEncoder.encode(user.getPassword()));
		return userInfoMapper.insertUserInfo(user);
	}

	public MsgVO doCheckUiId(String uiId) {
		MsgVO msgVO = new MsgVO();
		if (userInfoMapper.selectUserInfoByUiId(uiId) != null) {
			msgVO.setResultMsg("1");
		} else {
			msgVO.setResultMsg("0");
		}
		return msgVO;
	}

	public UserInfoVO selectUserInfoByUiId(String uiId) {
		return userInfoMapper.selectUserInfoByUiId(uiId);
	}

	public UserInfoVO selectUserInfoByUiNum(@AuthenticationPrincipal UserInfoVO user) {
		// TODO Auto-generated method stub
		return userInfoMapper.selectUserInfoByUiNum(user);
	}

	public boolean checkPassword(String uiId, Map<String, String> password) {
		UserInfoVO user = userInfoMapper.selectUserInfoByUiId(uiId);
		if (passwordEncoder.matches(password.get("password"), user.getUiPwd())) {
			return true;
		}
		return false;
	}

	public int updateUserProfile(int uiNum, Map<String, String> request) {
		UserInfoVO userInfoVO = new UserInfoVO();
		userInfoVO.setUiNum(uiNum);
		if (request.get("uiPwd") != null && !request.get("uiPwd").isBlank()) {
			request.put("uiPwd", passwordEncoder.encode(request.get("uiPwd")));
		}
		userInfoVO.setUiPwd(request.get("uiPwd"));
		userInfoVO.setUiEmail(request.get("uiEmail"));
		userInfoVO.setUiPhoneNum(request.get("uiPhoneNum"));
		userInfoVO.setUiAddress(request.get("uiAddress"));
		userInfoVO.setUiBirth(request.get("uiBirth"));
		userInfoVO.setUiActiveStatus(request.get("uiActiveStatus"));
		return userInfoMapper.updateUserInfos(userInfoVO);
	}

	public MsgVO deleteUser(UserInfoVO user) {
		MsgVO msgVO = new MsgVO();
		log.info("user => {}", user);

		List<TeamUserInfoVO> teamUserInfoVOs = teamUserInfoMapper.selectTeamUserInfoByUiNum(user.getUiNum());

		if (teamUserInfoVOs.size() != 0) {
			msgVO.setResultMsg("2");
			return msgVO;
		} else {
			try {
				String randomId = UUID.randomUUID() + "";
				String randomPwd = UUID.randomUUID() + "";
				user.setUiId(randomId.substring(0, 10));
				user.setUiPwd(randomPwd.substring(0, 10));
				user.setUiActiveStatus("1");
				userInfoMapper.updateUserInfos(user);
				teamSignUserInfoMapper.deleteTeamSignUserInfoByUiNum(user.getUiNum());
				msgVO.setResultMsg("0");
			} catch (Exception e) {
				msgVO.setResultMsg("1");
			}
		}
		return msgVO;
	}

}
