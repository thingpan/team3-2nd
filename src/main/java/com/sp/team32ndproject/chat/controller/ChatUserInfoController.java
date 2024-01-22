package com.sp.team32ndproject.chat.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.sp.team32ndproject.chat.service.ChatUserInfoService;
import com.sp.team32ndproject.chat.vo.ChatUserInfoVO;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ChatUserInfoController {
	
	private final ChatUserInfoService chatUserService;
	
	@PostMapping("/api/join")
	public ChatUserInfoVO join(@RequestBody ChatUserInfoVO chatUser) {
		return chatUserService.join(chatUser);
	}
	
	@PostMapping("/api/login")
	public ChatUserInfoVO login(@RequestBody ChatUserInfoVO chatUser) {
		return chatUserService.login(chatUser);
	}
}
