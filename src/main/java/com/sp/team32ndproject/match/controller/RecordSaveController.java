package com.sp.team32ndproject.match.controller;

import com.sp.team32ndproject.match.service.RecordSaveService;
import com.sp.team32ndproject.match.vo.MatchBoardInfoListVO;
import com.sp.team32ndproject.match.vo.RecordSaveVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/record-save")
public class RecordSaveController {

    @Autowired
    private RecordSaveService recordSaveService;

    @GetMapping("/select")
    public ResponseEntity<List<RecordSaveVO>> getAllRecordMatchResults() {
        List<RecordSaveVO> recordSaveList = recordSaveService.getAllRecordMatchResults();
        return ResponseEntity.ok(recordSaveList);
    }

    @PostMapping("/insert")
    public ResponseEntity<String> insertRecordMatchResult(@RequestBody RecordSaveVO recordSaveVO) {
        try {
            recordSaveService.insertRecordMatchResult(recordSaveVO);
            return ResponseEntity.ok("경기 결과가 저장되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("경기 결과 저장 중 오류가 발생했습니다.");
        }
    }
}

