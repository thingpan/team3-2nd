package com.sp.team32ndproject.match.mapper;

import com.sp.team32ndproject.match.vo.RecordSaveVO;

import java.util.List;

public interface RecordSaveMapper {
    int insertRecordMatchResult(RecordSaveVO recordSaveVO);
    List<RecordSaveVO> getAllRecordMatchResults();
}
