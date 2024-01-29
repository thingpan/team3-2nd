package com.sp.team32ndproject.common.filter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sp.team32ndproject.chat.util.DateUtil;
import com.sp.team32ndproject.common.listener.WebSocketEventListener;
import com.sp.team32ndproject.common.provider.JWTTokenProvider;
import com.sp.team32ndproject.user.vo.UserInfoVO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
	
	private final JWTTokenProvider jwt;
	private final ObjectMapper om;
	
	public CustomAuthenticationFilter(AuthenticationManager manager, JWTTokenProvider jwt, ObjectMapper om) {
		super(manager);
		this.jwt = jwt;
		this.om = om;
	}
	
	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException {
		//서버에 요청한 Http 메소드가 포스트가 아니면 사용자에게 해당하는 메세지를 반환한다
		if (!request.getMethod().equals("POST")) {
			throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
		}
		//POST요청인경우 페이로드로 들어오는 데이터값을 ObjectMapper를 통해서 UserInfoVO로 만들어준다
		try {
			UserInfoVO user = om.readValue(request.getInputStream(), UserInfoVO.class);
			//사용자가 입력한 값들
			UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(user.getUiId(), user.getUiPwd());
			//UsernamePasswordAuthenticationFilter 의 setDetails 메소드
			setDetails(request, authRequest);
			// Authentication 클래스를 반환
			return this.getAuthenticationManager().authenticate(authRequest);
		}catch(Exception e) {
			throw new AuthenticationServiceException("로그인 오류");
		}
	}
	//로그인 성공시 필터에서 반환해주는거
	@Override
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
			Authentication authResult) throws IOException, ServletException {
		//요청한것을 UserInfoVO로 변환
		log.info("status=>{}", response.getStatus());
		UserInfoVO user = (UserInfoVO)authResult.getPrincipal();
		user.setUiPwd(null);
		//요청한것을 토대로 jwt 토큰 string 생성
		String token = jwt.generateToken(authResult);
		//쿠키에 담아서 보냄
		user.setToken(token);
		user.setUiPwd(null);
		ResponseCookie resCookie = ResponseCookie.from(HttpHeaders.AUTHORIZATION, token)
				.httpOnly(true)
				.sameSite("None")
				.secure(true)
				.path("/")
				.maxAge(jwt.getTokenExpire())
				.build();
		for(UserInfoVO tmpUser : WebSocketEventListener.users) {
			if(user.getUiNum() == tmpUser.getUiNum()) {
				tmpUser.setLoginDate(DateUtil.getToDate());
			}
		}
		response.addHeader(HttpHeaders.SET_COOKIE, resCookie.toString());
		jsonWrite(response, om.writeValueAsString(user));
	}
	//로그인 실패시 실패메세지 반환
	@Override
	protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException failed) throws IOException, ServletException {
		Map<String,Object> body = new HashMap<>(); 
		body.put("msg", "실패했슈~");
		response.setStatus(HttpStatus.UNAUTHORIZED.value());
		jsonWrite(response, body);
	}
	
	// response 를 printWriter로 써줌
	private static void jsonWrite(HttpServletResponse res, String json) throws IOException {
		res.setContentType("application/json;charset=UTF-8");
		PrintWriter out = res.getWriter();
		out.print(json);
		out.flush();
		out.close();
	}
	private static void jsonWrite(HttpServletResponse res, Map<String,Object> body) throws IOException {
		res.setContentType("application/json;charset=UTF-8");
		PrintWriter out = res.getWriter();
		JSONObject json = new JSONObject(body);
		out.print(json);
		out.flush();
		out.close();
	}

}
