package org.endipi.assessment.resource;

import lombok.RequiredArgsConstructor;
import org.endipi.assessment.dto.request.ScheduleRequest;
import org.endipi.assessment.dto.response.ApiResponse;
import org.endipi.assessment.dto.response.ScheduleResponse;
import org.endipi.assessment.service.ScheduleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/schedule")
public class ScheduleResource {
    private final ScheduleService scheduleService;

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        List<ScheduleResponse> responses = scheduleService.findAll();

        ApiResponse<String, List<ScheduleResponse>> apiResponse =
                ApiResponse.<String, List<ScheduleResponse>>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(responses)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        ScheduleResponse response = scheduleService.findById(id);

        ApiResponse<String, ScheduleResponse> apiResponse =
                ApiResponse.<String, ScheduleResponse>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(response)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody ScheduleRequest request) {
        ScheduleResponse response = scheduleService.saveWithRetry(request);

        ApiResponse<String, ScheduleResponse> apiResponse =
                ApiResponse.<String, ScheduleResponse>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(response)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        scheduleService.deleteById(id);

        ApiResponse<String, Void> apiResponse = ApiResponse.<String, Void>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}