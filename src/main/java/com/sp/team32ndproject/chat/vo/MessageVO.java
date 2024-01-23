package com.sp.team32ndproject.chat.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString

public class MessageVO {
	private String message;
	private String sentTime;
	private String receivedTime;
	private String sender;
	private int senderUiNum;
	private int receiveUiNum;
	private String direction;
	private String position;
	private String type;
	private String payload;
}
