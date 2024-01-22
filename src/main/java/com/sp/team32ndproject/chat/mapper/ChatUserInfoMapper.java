package com.sp.team32ndproject.chat.mapper;

import com.sp.team32ndproject.chat.vo.ChatUserInfoVO;

public interface ChatUserInfoMapper {
	
	public int insertChatUserInfo(ChatUserInfoVO chatUser);
	public ChatUserInfoVO selectChatUserInfoById(String chiId);
}
