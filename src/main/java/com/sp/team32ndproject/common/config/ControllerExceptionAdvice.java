package com.sp.team32ndproject.common.config;

import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.sp.team32ndproject.common.exception.AuthException;



@ControllerAdvice
public class ControllerExceptionAdvice {
	
	@ExceptionHandler
	public ResponseEntity<String> authException(AuthException exception){
		ResponseEntity<String> res = new ResponseEntity<String>("로그인에 오류가 있습니다",HttpStatus.UNAUTHORIZED);
		return res;
	}
}
