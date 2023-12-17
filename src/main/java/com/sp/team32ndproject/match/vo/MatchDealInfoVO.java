package com.sp.team32ndproject.match.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MatchDealInfoVO {
    private int mdNum;
    private int mdsNum;
    private int taNum;
    private int mbNum;
    private int mdHomeNum;
    private int mdAwayNum;
    private String mdAddress;
    private String mdType;
    private String taName;
    private String mdTime;
    private String mdDate;
    private String mdMatchStatus;
}
