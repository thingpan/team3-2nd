package com.sp.team32ndproject.chat.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.sp.team32ndproject.chat.mapper.ChatMessageInfoMapper;
import com.sp.team32ndproject.chat.util.DateUtil;
import com.sp.team32ndproject.chat.vo.MessageVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
	
	private final ChatMessageInfoMapper chatMessageInfoMapper;
	
	public int insertChatMessageInfo(MessageVO messageVO) {
		messageVO.setSentTime(DateUtil.getToDate());
		return chatMessageInfoMapper.insertChatMessageInfo(messageVO);
	}
	
	public PageInfo<MessageVO> selectChatMessageInfos(MessageVO messageVO){
		PageHelper.startPage(1,100);
		return PageInfo.of(chatMessageInfoMapper.selectChatMessageInfos(messageVO));
	}
}
