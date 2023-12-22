package com.sp.team32ndproject.match.vo;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MatchBoardInfoVO {
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
	private String activityStatus;
	private int taMannerPoint;
	private int taPoint;
	private MultipartFile file;
	private List<MatchBoardPhotoInfoVO> matchPhotos;
	private int page;
	private int start;
	private int end;
	private int pageSize;
}
