package com.sp.team32ndproject.team.vo;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TeamInfoVO {
	private int taNum;
	private int uiNum;
	private int taMannerPoint;
	private int taPoint; 
	private int taMatchCount;
	private String taName;
	private String taBoundarySido;
	private String taBoundarySigungu;
	private String taDesc;
	private String taStatus;
	private String taType;
	private String taFilePath;
	private String taFileName;
	private MultipartFile taFile;
}
