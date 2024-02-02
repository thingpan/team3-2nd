package com.sp.team32ndproject.chat.controller;

import java.util.List;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestController;

import com.github.pagehelper.PageInfo;
import com.sp.team32ndproject.chat.service.ChatMessageService;
import com.sp.team32ndproject.chat.service.ChatUserInfoService;
import com.sp.team32ndproject.chat.vo.EnterVO;
import com.sp.team32ndproject.chat.vo.MessageVO;
import com.sp.team32ndproject.common.listener.WebSocketEventListener;
import com.sp.team32ndproject.user.service.UserInfoService;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ChatController {
	private final SimpMessagingTemplate smt;
	private final UserInfoService userService;
	private final ChatMessageService chatMessageService;
	
	@MessageMapping("/chat/{uiNum}")
	public void chat(@DestinationVariable("uiNum") int uiNum, MessageVO message) {
		log.info("message=>{}", message);
		smt.convertAndSend("/topic/chat/" + message.getCmiSenderUiNum(),message);
		smt.convertAndSend("/topic/chat/" + message.getCmiReceiveUiNum(),message);
		chatMessageService.insertChatMessageInfo(message);
	}
	
	@GetMapping("/chat/msg-infos")
	public PageInfo<MessageVO> getMsgList(@ModelAttribute MessageVO messageVO) {
		log.info("MSGvo=>{}", messageVO);
		return chatMessageService.selectChatMessageInfos(messageVO);
	}
}
