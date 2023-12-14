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
    private int mbNum;
    private String mdAddress;
    private String taName;
    private String mdTime;
    private String mdDate;
    private String mdMatchStatus;
}
