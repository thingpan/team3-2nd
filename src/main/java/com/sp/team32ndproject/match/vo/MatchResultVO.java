package com.sp.team32ndproject.match.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MatchResultVO {
    private int mrNum;
    private int mdNum;
    private int taHomeNum;
    private int taAwayNum;
    private String mrHomeScore;
    private String mrAwayScore;
    private int mrHomeMannerPoint;
    private int mrAwayMannerPoint;
    private char mrRequestStatus;
    private String mdDate;
    private String mdAddress;
    private String taName;
}

