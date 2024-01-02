package com.sp.team32ndproject.react;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/react")
@CrossOrigin("*")
public class ReactController {
	
	@GetMapping("/list")
	public List<Map<String, String>> getList(){
		List<Map<String, String>> strs = new ArrayList<Map<String,String>>();
		Map<String, String> map = new HashMap<String, String>();
		map.put("id", "1");
		map.put("name", "고길동"); 
		strs.add(map);
		map = new HashMap<String, String>();
		map.put("id", "2");
		map.put("name", "김길동");
		strs.add(map);
		return strs;
	}
}
