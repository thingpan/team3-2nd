package com.sp.team32ndproject.match.service;

import com.sp.team32ndproject.match.mapper.MatchResultMapper;
import com.sp.team32ndproject.match.mapper.RecordSaveMapper;
import com.sp.team32ndproject.match.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecordSaveService {
    @Autowired
    private RecordSaveMapper recordSaveMapper;

    public void insertRecordMatchResult(RecordSaveVO recordSaveVO) {
        recordSaveMapper.insertRecordMatchResult(recordSaveVO);
    }

    public List<RecordSaveVO> getAllRecordMatchResults() {
        return recordSaveMapper.getAllRecordMatchResults();
    }

}

