package org.endipi.enrollment.resource;

import lombok.RequiredArgsConstructor;
import org.endipi.enrollment.dto.request.SemesterRequest;
import org.endipi.enrollment.dto.response.ApiResponse;
import org.endipi.enrollment.dto.response.SemesterResponse;
import org.endipi.enrollment.service.SemesterService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/semester")
public class SemesterResource {
    private final SemesterService semesterService;

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        List<SemesterResponse> responses = semesterService.findAll();

        ApiResponse<String, List<SemesterResponse>> apiResponse =
                ApiResponse.<String, List<SemesterResponse>>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(responses)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/all/page")
    public ResponseEntity<?> getAllSemesters(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String sort,
            @RequestParam(required = false) String searchValue,
            @RequestParam(defaultValue = "name") String searchCriterion
    ) {
        Page<SemesterResponse> response = semesterService.findBySearchingCriterion(page, size, sort, searchValue, searchCriterion);

        ApiResponse<String, Page<SemesterResponse>> apiResponse = ApiResponse.<String, Page<SemesterResponse>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(response)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        SemesterResponse response = semesterService.findById(id);

        ApiResponse<String, SemesterResponse> apiResponse =
                ApiResponse.<String, SemesterResponse>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(response)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody SemesterRequest request) {
        SemesterResponse response = semesterService.saveWithRetry(request);

        ApiResponse<String, SemesterResponse> apiResponse =
                ApiResponse.<String, SemesterResponse>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(response)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        semesterService.deleteById(id);

        ApiResponse<String, Void> apiResponse = ApiResponse.<String, Void>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}