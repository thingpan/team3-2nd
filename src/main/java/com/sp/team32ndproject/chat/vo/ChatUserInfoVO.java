package com.sp.team32ndproject.chat.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class ChatUserInfoVO {
	
	private int chiNum;
	private String chiId;
	private String chiPwd;
	private String chiName;
}

