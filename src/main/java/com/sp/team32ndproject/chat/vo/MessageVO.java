package com.sp.team32ndproject.chat.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MessageVO {
	private String cmiMessage;
	private String cmiSentTime;
	private String cmiReceivedTime;
	private String cmiSender;
	private int cmiSenderUiNum;
	private int cmiReceiveUiNum;
	private String cmiDirection;
	private String cmiPosition;
	private String cmiType;
	private String payload;
	private boolean typing;
	private int unreadCnt;
}
