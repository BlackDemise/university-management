package org.endipi.enrollment.resource;

import lombok.RequiredArgsConstructor;
import org.endipi.enrollment.dto.request.CourseRegistrationRequest;
import org.endipi.enrollment.dto.response.ApiResponse;
import org.endipi.enrollment.dto.response.CourseRegistrationResponse;
import org.endipi.enrollment.service.CourseRegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/course-registration")
public class CourseRegistrationResource {
    private final CourseRegistrationService courseRegistrationService;

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        List<CourseRegistrationResponse> responses = courseRegistrationService.findAll();

        ApiResponse<String, List<CourseRegistrationResponse>> apiResponse =
                ApiResponse.<String, List<CourseRegistrationResponse>>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(responses)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        CourseRegistrationResponse response = courseRegistrationService.findById(id);

        ApiResponse<String, CourseRegistrationResponse> apiResponse =
                ApiResponse.<String, CourseRegistrationResponse>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(response)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody CourseRegistrationRequest request) {
        CourseRegistrationResponse response = courseRegistrationService.saveWithRetry(request);

        ApiResponse<String, CourseRegistrationResponse> apiResponse =
                ApiResponse.<String, CourseRegistrationResponse>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(response)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        courseRegistrationService.deleteById(id);

        ApiResponse<String, Void> apiResponse = ApiResponse.<String, Void>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    // S2S ENDPOINT -> no ApiResponse wrapper for clarity
    @GetMapping("/{courseRegistrationId}/validate")
    public ResponseEntity<Boolean> validateCourseRegistration(@PathVariable Long courseRegistrationId) {
        return ResponseEntity.ok(courseRegistrationService.validateCourseRegistration(courseRegistrationId));
    }
}