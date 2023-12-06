package com.sp.team32ndproject.team.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TeamUserInfoVO {
	private int tuNum;
	private int uiNum;
	private int taNum;
	private String tuRole;
	private String uiName;
	private String uiAddress;
	private String uiPhoneNum;
	private int page;
	private int start;
	private int end;
	private int pageSize; 
}
