package com.sp.team32ndproject.match.vo;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MatchInfoVO {
	private int mbNum;
	private int taNum;
	private int mbPay;
	private String mbAddress;
	private String mbAddressDetail;
	private String mbMapX;
	private String mbMapY;
	private String mbSido;
	private String mbSigungu;
	private String mbTime;
	private String mbDate;
	private String mbCredat;
	private String mbStatus;
	private String mbDesc;
	private String mbType;
	private MultipartFile file;
}
