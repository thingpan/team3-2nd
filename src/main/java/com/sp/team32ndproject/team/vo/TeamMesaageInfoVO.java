package com.sp.team32ndproject.team.vo;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TeamMesaageInfoVO {
	   private int pmNum;
	    private int pmrNum;
	    private int pmSendNum;
	    private String pmMessage;
	    private String pmCredat;
	    private String pmCretim;
}
