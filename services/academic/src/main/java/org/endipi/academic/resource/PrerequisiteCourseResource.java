package org.endipi.academic.resource;

import lombok.RequiredArgsConstructor;
import org.endipi.academic.dto.request.PrerequisiteCourseRequest;
import org.endipi.academic.dto.response.ApiResponse;
import org.endipi.academic.dto.response.PrerequisiteCourseResponse;
import org.endipi.academic.service.PrerequisiteCourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/prerequisite-course")
public class PrerequisiteCourseResource {
    private final PrerequisiteCourseService prerequisiteCourseService;

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        List<PrerequisiteCourseResponse> prerequisiteCourseResponses = prerequisiteCourseService.findAll();

        ApiResponse<String, List<PrerequisiteCourseResponse>> apiResponse = ApiResponse.<String, List<PrerequisiteCourseResponse>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(prerequisiteCourseResponses)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        PrerequisiteCourseResponse prerequisiteCourseResponse = prerequisiteCourseService.findById(id);

        ApiResponse<String, PrerequisiteCourseResponse> apiResponse = ApiResponse.<String, PrerequisiteCourseResponse>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(prerequisiteCourseResponse)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody PrerequisiteCourseRequest prerequisiteCourseRequest) {
        PrerequisiteCourseResponse prerequisiteCourseResponse = prerequisiteCourseService.saveWithRetry(prerequisiteCourseRequest);

        ApiResponse<String, PrerequisiteCourseResponse> apiResponse = ApiResponse.<String, PrerequisiteCourseResponse>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(prerequisiteCourseResponse)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/{prerequisiteCourseId}")
    public ResponseEntity<?> deleteById(@PathVariable Long prerequisiteCourseId) {
        prerequisiteCourseService.deleteById(prerequisiteCourseId);

        ApiResponse<String, Void> apiResponse = ApiResponse.<String, Void>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}