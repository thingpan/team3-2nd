package com.sp.team32ndproject.chat.mapper;

import java.util.List;

import com.sp.team32ndproject.chat.vo.MessageVO;

public interface ChatMessageInfoMapper {
	int insertChatMessageInfo(MessageVO messageVO);
	List<MessageVO> selectChatMessageInfos(MessageVO messageVO);
}
