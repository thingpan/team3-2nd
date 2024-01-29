package com.sp.team32ndproject.chat.service;

import org.springframework.stereotype.Service;

import com.sp.team32ndproject.chat.mapper.ChatMessageInfoMapper;
import com.sp.team32ndproject.chat.mapper.ChatUserInfoMapper;
import com.sp.team32ndproject.chat.vo.ChatUserInfoVO;
import com.sp.team32ndproject.common.exception.AuthException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatUserInfoService {
	private final ChatUserInfoMapper chatUserMapper;

	public ChatUserInfoVO join(ChatUserInfoVO chatUser) {
		if (chatUserMapper.insertChatUserInfo(chatUser) == 1) {
			return chatUser;
		}
		return null;
	}

	public ChatUserInfoVO login(ChatUserInfoVO chatUser) {
		ChatUserInfoVO user = chatUserMapper.selectChatUserInfoById(chatUser.getChiId());
		if (user.getChiPwd().equals(chatUser.getChiPwd())) {
			return user;
		}
		throw new AuthException("로그인 오류");
	}
}
