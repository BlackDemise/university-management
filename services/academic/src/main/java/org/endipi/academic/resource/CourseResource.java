package org.endipi.academic.resource;

import lombok.RequiredArgsConstructor;
import org.endipi.academic.dto.request.CourseRequest;
import org.endipi.academic.dto.response.ApiResponse;
import org.endipi.academic.dto.response.CourseResponse;
import org.endipi.academic.dto.response.DepartmentResponse;
import org.endipi.academic.service.CourseService;
import org.endipi.academic.util.EnumUtil;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/course")
@RequiredArgsConstructor
public class CourseResource {
    private final CourseService courseService;
    private final EnumUtil enumUtil;

    @GetMapping("/enum/course-types")
    public ResponseEntity<?> getCourseTypes() {
        Map<String, String> courseTypes = enumUtil.getCourseTypes();

        ApiResponse<String, Map<String, String>> apiResponse = ApiResponse.<String, Map<String, String>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(courseTypes)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

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

    @GetMapping("/all/page")
    public ResponseEntity<?> getAllCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) String searchValue,
            @RequestParam(defaultValue = "name") String searchCriterion
    ) {
        Page<CourseResponse> response = courseService.findBySearchingCriterion(page, size, sort, searchValue, searchCriterion);

        ApiResponse<String, Page<CourseResponse>> apiResponse = ApiResponse.<String, Page<CourseResponse>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(response)
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

    // S2S ENDPOINT -> no ApiResponse wrapper for clarity
    @GetMapping("/validate/{courseId}")
    public ResponseEntity<Boolean> validateCourse(@PathVariable Long courseId) {
        boolean isValid = courseService.validateCourse(courseId);

        return ResponseEntity.ok(isValid);
    }

    // S2S ENDPOINT -> no ApiResponse wrapper for clarity
    @GetMapping("/s2s/details/{courseId}")
    public ResponseEntity<CourseResponse> getCourseDetails(@PathVariable Long courseId) {
        CourseResponse courseResponse = courseService.findById(courseId);

        return ResponseEntity.ok(courseResponse);
    }

    // S2S ENDPOINT -> no ApiResponse wrapper for clarity
    @GetMapping("/s2s/all")
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        List<CourseResponse> courseResponses = courseService.findAll();

        return ResponseEntity.ok(courseResponses);
    }
}
