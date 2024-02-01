package com.sp.team32ndproject.common.listener;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.http.HttpHeaders;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import com.sp.team32ndproject.chat.util.DateUtil;
import com.sp.team32ndproject.user.service.UserInfoService;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {
	public static List<Integer> uiNums = Collections.synchronizedList(new ArrayList<>());
	public static List<String> sessionIds = Collections.synchronizedList(new ArrayList<>());
	public static List<UserInfoVO> users = Collections.synchronizedList(new ArrayList<>());
	private final SimpMessagingTemplate smt;
	private final UserInfoService userService;

	@EventListener
	public void connectionListener(SessionConnectedEvent evt) {
		if (users == null || users.isEmpty()) {
			List<UserInfoVO> tmpUsers = userService.selectUserInfos(null);
			users = Collections.synchronizedList(tmpUsers);
		}
		StompHeaderAccessor sha = StompHeaderAccessor.wrap(evt.getMessage());
		GenericMessage<?> gm = (GenericMessage<?>) sha.getHeader(SimpMessageHeaderAccessor.CONNECT_MESSAGE_HEADER);
		SimpMessageHeaderAccessor smha = SimpMessageHeaderAccessor.wrap(gm);
		int uiNum = Integer.parseInt(smha.getFirstNativeHeader("uiNum"));
		String sessionId = smha.getSessionId();
		String loginDate = DateUtil.getToDate();
		
		for (UserInfoVO user : users) {
			if (user.getUiNum() == uiNum) {
				user.setSessionId(sessionId);
				user.setLogin(true);
				user.setLoginDate(loginDate);
			}
		}
		smt.convertAndSend("/topic/enter-chat", users);
	}

	@EventListener
	public void disconnectionListener(SessionDisconnectEvent evt) {
		StompHeaderAccessor sha = StompHeaderAccessor.wrap(evt.getMessage());
		String sessionId = sha.getSessionId();
		
		for (UserInfoVO user : users) {
			if (sessionId.equals(user.getSessionId())) {
				user.setSessionId(null);
				user.setLogin(false);
			}
		}
		smt.convertAndSend("/topic/enter-chat", users);
	}

	@EventListener // 구독 할때
	public void subscribeListener(SessionSubscribeEvent evt) {
		String destination = (String) evt.getMessage().getHeaders().get("simpDestination");
		if("/topic/enter-chat".equals(destination)) {
			smt.convertAndSend("/topic/enter-chat",users);
		}
		log.info("subscribe => {}", evt);
	}

	@EventListener
	public void unsubscribeListener(SessionUnsubscribeEvent evt) {
		String destination = (String) evt.getMessage().getHeaders().get("simpDestination");
		if("/topic/enter-chat".equals(destination)) {
			smt.convertAndSend("/topic/enter-chat",users);
		}
	}

}
