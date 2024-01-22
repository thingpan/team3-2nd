package com.sp.team32ndproject.common.listener;


import org.apache.http.HttpHeaders;
import org.apache.logging.log4j.message.SimpleMessage;
import org.springframework.boot.web.servlet.server.Session;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;

import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class WebSocketEventListener {

	@EventListener
	public void connectionListener(SessionConnectedEvent evt) {
		StompHeaderAccessor sha = StompHeaderAccessor.wrap(evt.getMessage());
		GenericMessage<?> gm =(GenericMessage<?>)sha.getHeader(SimpMessageHeaderAccessor.CONNECT_MESSAGE_HEADER);
		SimpMessageHeaderAccessor smha =SimpMessageHeaderAccessor.wrap(gm);
		int uiNum =Integer.parseInt(smha.getFirstNativeHeader("uiNum"));
		String token =smha.getFirstNativeHeader(HttpHeaders.AUTHORIZATION);
		log.info("connection => {}",evt);
		log.info("uiNum => {}",uiNum);
		log.info("token => {}",token);
	}
	@EventListener
	public void disconnectionListener(SessionDisconnectEvent evt) {
		log.info("disconnection => {}",evt);
	}
}
