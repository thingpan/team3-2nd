package com.sp.team32ndproject.common.util;

import javax.servlet.http.HttpSession;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.sp.team32ndproject.user.vo.UserInfoVO;

public class SessionUtil {
	public static Object getSessionUser() {
		if(SecurityContextHolder.getContext().getAuthentication()==null) {
			return "Non-session";
		}
		return SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
	}
	
	public static boolean isLogin() {
		if(getSessionUser() instanceof UserInfoVO) {
			return true;
		}
		return false;
	}
}
