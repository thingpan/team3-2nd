package com.sp.team32ndproject.match.service;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.sp.team32ndproject.common.util.StringUtils;
import com.sp.team32ndproject.match.vo.MatchInfoVO;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MatchInfoService {
	
	@Value("${upload.file-path}")
	private String filiePath;
	
	 public MatchInfoVO insertMatchInfo(MatchInfoVO match) throws IllegalStateException, IOException {
		 String fileName = match.getFile().getOriginalFilename();
		 log.info("fileName=>{}", fileName);
		 if(match.getFile()!=null && !fileName.isEmpty()) {
				
				String uuid = UUID.randomUUID().toString();
				
				int idx = fileName.lastIndexOf(".");
				String extName = StringUtils.getExt(fileName);
				String saveFilePath = filiePath+"/" + uuid + extName;
				File file = new File(saveFilePath);
				
				match.getFile().transferTo(file);
				log.info("fileName=>{}",fileName);
//				match.setBiFileName(fileName);
//				match.setBiFilePath(uuid + extName);
			}
		 return null;
	 }
}
