package com.sp.team32ndproject.team.vo;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TeamMessageRoomVO {
	 private int pmrNum;
	    private int pmrOpponentNum;
	    private String pmrLastPostMessage;
	    private String pmrStatus;
	    private int taNum;
	    
}
