package org.endipi.academic.resource;

import lombok.RequiredArgsConstructor;
import org.endipi.academic.dto.request.CourseRequest;
import org.endipi.academic.dto.response.ApiResponse;
import org.endipi.academic.dto.response.CourseResponse;
import org.endipi.academic.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/course")
@RequiredArgsConstructor
public class CourseResource {
    private final CourseService courseService;

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        List<CourseResponse> courseResponses = courseService.findAll();

        ApiResponse<String, List<CourseResponse>> apiResponse = ApiResponse.<String, List<CourseResponse>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(courseResponses)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        CourseResponse courseResponse = courseService.findById(id);

        ApiResponse<String, CourseResponse> apiResponse = ApiResponse.<String, CourseResponse>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(courseResponse)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody CourseRequest courseRequest) {
        CourseResponse courseResponse = courseService.saveWithRetry(courseRequest);

        ApiResponse<String, CourseResponse> apiResponse = ApiResponse.<String, CourseResponse>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(courseResponse)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        courseService.deleteById(id);

        ApiResponse<String, Void> apiResponse = ApiResponse.<String, Void>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
