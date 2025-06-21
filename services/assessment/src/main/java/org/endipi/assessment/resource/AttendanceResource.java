package org.endipi.assessment.resource;

import lombok.RequiredArgsConstructor;
import org.endipi.assessment.dto.request.AttendanceRequest;
import org.endipi.assessment.dto.response.ApiResponse;
import org.endipi.assessment.dto.response.AttendanceResponse;
import org.endipi.assessment.service.AttendanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/attendance")
public class AttendanceResource {
    private final AttendanceService attendanceService;

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        List<AttendanceResponse> responses = attendanceService.findAll();

        ApiResponse<String, List<AttendanceResponse>> apiResponse =
                ApiResponse.<String, List<AttendanceResponse>>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(responses)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        AttendanceResponse response = attendanceService.findById(id);

        ApiResponse<String, AttendanceResponse> apiResponse =
                ApiResponse.<String, AttendanceResponse>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(response)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody AttendanceRequest request) {
        AttendanceResponse response = attendanceService.saveWithRetry(request);

        ApiResponse<String, AttendanceResponse> apiResponse =
                ApiResponse.<String, AttendanceResponse>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(response)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        attendanceService.deleteById(id);

        ApiResponse<String, Void> apiResponse = ApiResponse.<String, Void>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}