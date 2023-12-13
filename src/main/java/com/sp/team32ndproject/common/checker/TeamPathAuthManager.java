package com.sp.team32ndproject.common.checker;

import java.util.Map;
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
public class TeamPathAuthManager implements AuthorizationManager<RequestAuthorizationContext> {
	
	private final TeamInfoService teamInfoService;
	
	@Override
	public AuthorizationDecision check(Supplier<Authentication> authentication, RequestAuthorizationContext object) {
		
		UserInfoVO userInfoVO = (UserInfoVO)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		Map<String,String> teamPath = object.getVariables();
		int taNum = Integer.parseInt( teamPath.get("taNum"));
		
		if(teamInfoService.selectAdminByUiNumAndTaNum(userInfoVO.getUiNum(), taNum) != null){
			return new AuthorizationDecision(true);
		}
		return new AuthorizationDecision(false);
	}
	
}
