package org.endipi.assessment.resource;

import lombok.RequiredArgsConstructor;
import org.endipi.assessment.dto.request.SessionRequest;
import org.endipi.assessment.dto.response.ApiResponse;
import org.endipi.assessment.dto.response.CourseSessionSummaryResponse;
import org.endipi.assessment.dto.response.SessionResponse;
import org.endipi.assessment.dto.response.SessionWithDetailsResponse;
import org.endipi.assessment.service.SessionService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/session")
public class SessionResource {
    private final SessionService sessionService;

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        List<SessionResponse> responses = sessionService.findAll();

        ApiResponse<String, List<SessionResponse>> apiResponse =
                ApiResponse.<String, List<SessionResponse>>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(responses)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        SessionResponse response = sessionService.findById(id);

        ApiResponse<String, SessionResponse> apiResponse =
                ApiResponse.<String, SessionResponse>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(response)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody SessionRequest request) {
        SessionResponse response = sessionService.saveWithRetry(request);

        ApiResponse<String, SessionResponse> apiResponse =
                ApiResponse.<String, SessionResponse>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(response)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        sessionService.deleteById(id);

        ApiResponse<String, Void> apiResponse = ApiResponse.<String, Void>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    // New optimized endpoints for UI
    @GetMapping("/course-session-summary")
    public ResponseEntity<?> getCourseSessionSummary(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "courseOfferingId,asc") String sort) {

        Page<CourseSessionSummaryResponse> response = sessionService.getOptimizedSessionSummary(page, size, sort);

        ApiResponse<String, Page<CourseSessionSummaryResponse>> apiResponse =
                ApiResponse.<String, Page<CourseSessionSummaryResponse>>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(response)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/by-course-offering/{courseOfferingId}")
    public ResponseEntity<?> getSessionsByOffering(@PathVariable Long courseOfferingId) {
        List<SessionWithDetailsResponse> responses = sessionService.getSessionsWithDetailsByOffering(courseOfferingId);

        ApiResponse<String, List<SessionWithDetailsResponse>> apiResponse =
                ApiResponse.<String, List<SessionWithDetailsResponse>>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(responses)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/by-course-offering/{courseOfferingId}/page")
    public ResponseEntity<?> getSessionsByOfferingWithPaging(
            @PathVariable Long courseOfferingId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "sessionNumber,asc") String sort) {

        Page<SessionWithDetailsResponse> response = sessionService.getSessionsWithDetailsByOfferingWithPaging(courseOfferingId, page, size, sort);

        ApiResponse<String, Page<SessionWithDetailsResponse>> apiResponse =
                ApiResponse.<String, Page<SessionWithDetailsResponse>>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(response)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }
}