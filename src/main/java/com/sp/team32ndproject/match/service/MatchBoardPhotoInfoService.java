package com.sp.team32ndproject.match.service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sp.team32ndproject.match.mapper.MatchBoardPhotoInfoMapper;
import com.sp.team32ndproject.match.vo.MatchBoardPhotoInfoVO;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Service
@RequiredArgsConstructor
@Slf4j
public class MatchBoardPhotoInfoService {
	
	@Value("${upload.file-path}")
	private String uploadFilePath;
	
	private final MatchBoardPhotoInfoMapper matchBoardPhotoInfoMapper;
	
	public int insertMatchBoardPhotoInfo(int mbNum, List<MatchBoardPhotoInfoVO> matchPhotos) {
		int result = 0;
		for(MatchBoardPhotoInfoVO matchPhoto : matchPhotos) {
			MultipartFile file = matchPhoto.getFile();
			String originName = matchPhoto.getFile().getOriginalFilename();
			String extName = originName.substring(originName.lastIndexOf("."));
			String fileName = UUID.randomUUID() + extName;
			matchPhoto.setMbpFileName(originName);
			matchPhoto.setMbpFilePath("/file/" + fileName);
			
			try {
				file.transferTo(new File(uploadFilePath + fileName));
			} catch (IllegalStateException e) {
				log.error("error => {}", e.getMessage());
			} catch (IOException e) {
				log.error("error =>{}",e.getMessage());
			}
			
			matchPhoto.setMbNum(mbNum);
			result += matchBoardPhotoInfoMapper.insertMatchBoardPhotoInfo(matchPhoto);
		}
		
		return result; 
	}
}
