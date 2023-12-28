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
import com.sp.team32ndproject.type.Status;

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
		if (matchPhotos != null && !matchPhotos.isEmpty()) {
			for (MatchBoardPhotoInfoVO matchPhoto : matchPhotos) {
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
					log.error("error =>{}", e.getMessage());
				}

				matchPhoto.setMbNum(mbNum);
				result += matchBoardPhotoInfoMapper.insertMatchBoardPhotoInfo(matchPhoto);
			}
		}
		return result;
	}

	public int updateGoodsFileInfos(int mbNum, List<MatchBoardPhotoInfoVO> matchPhotos) {

		int result = 0;
		for (MatchBoardPhotoInfoVO matchPhoto : matchPhotos) {
			if (matchPhoto.getStatus() == Status.DELETE) {
				String fileName = matchPhoto.getMbpFilePath();
				int idx = fileName.lastIndexOf("/") + 1;
				fileName = fileName.substring(idx);
				File f = new File(uploadFilePath + fileName);
				if (f.exists()) {
					f.delete();
				}
				result += matchBoardPhotoInfoMapper.deleteMatchBoardPhotoInfos(matchPhoto.getMbpNum());
				continue;
			}
			MultipartFile file = matchPhoto.getFile();
			if (file != null) {
				String originName = file.getOriginalFilename(); // abcd.png
				String extName = originName.substring(originName.lastIndexOf(".")); // .png
				String fileName = UUID.randomUUID() + extName;
				matchPhoto.setMbpFileName(fileName);
				matchPhoto.setMbpFilePath("/file/" + fileName);
				try {
					file.transferTo(new File(uploadFilePath + fileName));
				} catch (IllegalStateException e) {
					log.error("file upload error=>{}", e);
				} catch (IOException e) {
					log.error("file upload error=>{}", e);
				}
			}
			matchPhoto.setMbNum(mbNum);
			if (file != null) {
				if (matchPhoto.getStatus() == Status.UPDATE) {
					result += matchBoardPhotoInfoMapper.updateMatchBoardPhotoInfos(matchPhoto);
				} else {
					result += matchBoardPhotoInfoMapper.insertMatchBoardPhotoInfo(matchPhoto);
				}
			}
		}
		return result;
	}

	public List<MatchBoardPhotoInfoVO> selectMatchBoardInfo(int mbNum) {
		return matchBoardPhotoInfoMapper.selectMatchBoardInfo(mbNum);
	}
}
