package com.sp.team32ndproject.chat.vo;

import java.util.List;

import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class EnterVO {
	private List<UserInfoVO> users;
}
