package com.sp.team32ndproject.chat.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import com.sp.team32ndproject.chat.vo.MessageVO;
import com.sp.team32ndproject.user.service.UserInfoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ChatController {
	private final SimpMessagingTemplate smt;
	private final UserInfoService userService;
	
	@MessageMapping("/chat/{uiNum}")
	public void chat(@DestinationVariable("uiNum") int uiNum, MessageVO message) {
		smt.convertAndSend("/topic/chat" + uiNum, message);
	}

	@MessageMapping("/enter-chat/{uiNum}")
	public void enterchat(@DestinationVariable("uiNum") int uiNum, MessageVO message) {
		smt.convertAndSend("/topic/enter" + uiNum, message);
	}
}
