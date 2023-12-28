package com.sp.team32ndproject.match.vo;

import org.springframework.web.multipart.MultipartFile;

import com.sp.team32ndproject.type.Status;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MatchBoardPhotoInfoVO {
	private int mbpNum;
	private int mbNum;
	private String mbpFileName;
	private String mbpFilePath;
	private MultipartFile file;
	private Status status;
}
