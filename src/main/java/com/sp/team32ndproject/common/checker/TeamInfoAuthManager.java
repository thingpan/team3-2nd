package com.sp.team32ndproject.common.checker;

import java.util.function.Supplier;

import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;

import com.sp.team32ndproject.team.mapper.TeamInfoMapper;
import com.sp.team32ndproject.team.service.TeamInfoService;
import com.sp.team32ndproject.team.vo.TeamInfoVO;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class TeamInfoAuthManager implements AuthorizationManager<RequestAuthorizationContext> {
	private final TeamInfoMapper teamInfoMapper;

	@Override
	public AuthorizationDecision check(Supplier<Authentication> authentication, RequestAuthorizationContext object) {
		if (object.getRequest().getParameter("taNum") == null) {
			return new AuthorizationDecision(true);
		}

		int taNum = Integer.parseInt(object.getRequest().getParameter("taNum"));

		TeamInfoVO teamInfo = teamInfoMapper.selectTaTypeMatchBoardInfoByTaNum(taNum);

		if (teamInfo.getTaActiveStatus().equals("0")) {
			return new AuthorizationDecision(true);
		} else {
			return new AuthorizationDecision(false);
		}
	}
}
