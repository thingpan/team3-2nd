package com.sp.team32ndproject.common.listener;

import org.springframework.boot.web.servlet.server.Session;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class WebSocketEventListener {

	@EventListener
	public void connectionListener(SessionConnectedEvent evt) {
		log.info("connection => {}",evt);
	}
	@EventListener
	public void disconnectionListener(SessionConnectedEvent evt) {
		log.info("disconnection => {}",evt);
	}
}
