package com.sp.team32ndproject.match.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RecordSaveVO {
    private int rsNum;
    private int mdNum;
    private String rsDate;
    private String rsTime;
    private String rsAddress;
    private String rsTmName;
    private String rsType;
    private char rsMatchStatus;
}

