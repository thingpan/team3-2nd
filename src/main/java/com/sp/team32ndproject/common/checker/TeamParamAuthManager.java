package com.sp.team32ndproject.common.checker;


import java.util.function.Supplier;

import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;

import com.sp.team32ndproject.team.service.TeamInfoService;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.RequiredArgsConstructor;


@RequiredArgsConstructor
public final class TeamParamAuthManager implements AuthorizationManager<RequestAuthorizationContext> {
	
	private final TeamInfoService teamInfoService;
	
	@Override
	public AuthorizationDecision check(Supplier<Authentication> authentication, RequestAuthorizationContext object) {
		if(object.getRequest().getParameter("taNum")==null) {
	        return new AuthorizationDecision(false);
		}
		 
		UserInfoVO userInfoVO = (UserInfoVO)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		int taNum = Integer.parseInt(object.getRequest().getParameter("taNum"));
		
		
		if(teamInfoService.selectAdminByUiNumAndTaNum(userInfoVO.getUiNum(), taNum) != null) {
			return new AuthorizationDecision(true);
		}
        return new AuthorizationDecision(false);
	}

}
