package com.sp.team32ndproject.common.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HTMLController {
	@GetMapping("/")
	public String goHome() {
		return "index";
	}
}
