package org.endipi.enrollment.resource;

import lombok.RequiredArgsConstructor;
import org.endipi.enrollment.dto.request.CourseOfferingRequest;
import org.endipi.enrollment.dto.response.ApiResponse;
import org.endipi.enrollment.dto.response.CourseOfferingResponse;
import org.endipi.enrollment.service.CourseOfferingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/course-offering")
public class CourseOfferingResource {
    private final CourseOfferingService courseOfferingService;

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        List<CourseOfferingResponse> responses = courseOfferingService.findAll();

        ApiResponse<String, List<CourseOfferingResponse>> apiResponse =
                ApiResponse.<String, List<CourseOfferingResponse>>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(responses)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        CourseOfferingResponse response = courseOfferingService.findById(id);

        ApiResponse<String, CourseOfferingResponse> apiResponse =
                ApiResponse.<String, CourseOfferingResponse>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(response)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody CourseOfferingRequest request) {
        CourseOfferingResponse response = courseOfferingService.saveWithRetry(request);

        ApiResponse<String, CourseOfferingResponse> apiResponse =
                ApiResponse.<String, CourseOfferingResponse>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(response)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        courseOfferingService.deleteById(id);

        ApiResponse<String, Void> apiResponse = ApiResponse.<String, Void>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    // S2S ENDPOINT -> no ApiResponse wrapper for clarity
    @GetMapping("/{courseOfferingId}/validate")
    public ResponseEntity<Boolean> validateCourseOffering(@PathVariable Long courseOfferingId) {
        boolean isValid = courseOfferingService.validateCourseOffering(courseOfferingId);
        return ResponseEntity.ok(isValid);
    }
}
