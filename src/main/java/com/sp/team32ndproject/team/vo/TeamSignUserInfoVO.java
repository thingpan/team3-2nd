package com.sp.team32ndproject.team.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TeamSignUserInfoVO {
	private int tsuNum;
	private int taNum;
	private int uiNum;
	private String tsuStatus;
	private String uiName;
	private String uiAddress;
	private String uiPhoneNum;
	private int page;
	private int start;
	private int end;
	private int pageSize;
}
