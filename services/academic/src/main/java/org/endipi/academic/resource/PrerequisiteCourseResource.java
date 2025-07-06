package org.endipi.academic.resource;

import lombok.RequiredArgsConstructor;
import org.endipi.academic.dto.request.PrerequisiteCourseRequest;
import org.endipi.academic.dto.request.UpdatePrerequisitesRequest;
import org.endipi.academic.dto.response.ApiResponse;
import org.endipi.academic.dto.response.CoursePrerequisiteDetailsResponse;
import org.endipi.academic.dto.response.CoursePrerequisiteSummaryResponse;
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
    
    // ===============================
    // ENHANCED ENDPOINTS FOR UI SUPPORT
    // ===============================
    
    @GetMapping("/courses/summary")
    public ResponseEntity<?> getAllCoursesWithPrerequisiteInfo() {
        List<CoursePrerequisiteSummaryResponse> summaries = prerequisiteCourseService.getAllCoursesWithPrerequisiteInfo();

        ApiResponse<String, List<CoursePrerequisiteSummaryResponse>> apiResponse = ApiResponse.<String, List<CoursePrerequisiteSummaryResponse>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(summaries)
                .build();

        return ResponseEntity.ok(apiResponse);
    }
    
    @GetMapping("/courses/{courseId}/details")
    public ResponseEntity<?> getCoursePrerequisiteDetails(@PathVariable Long courseId) {
        CoursePrerequisiteDetailsResponse details = prerequisiteCourseService.getCoursePrerequisiteDetails(courseId);

        ApiResponse<String, CoursePrerequisiteDetailsResponse> apiResponse = ApiResponse.<String, CoursePrerequisiteDetailsResponse>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(details)
                .build();

        return ResponseEntity.ok(apiResponse);
    }
    
    @GetMapping("/courses/{courseId}/available-prerequisites")
    public ResponseEntity<?> getAvailablePrerequisiteOptions(@PathVariable Long courseId) {
        List<CoursePrerequisiteDetailsResponse.CourseOption> options = prerequisiteCourseService.getAvailablePrerequisiteOptions(courseId);

        ApiResponse<String, List<CoursePrerequisiteDetailsResponse.CourseOption>> apiResponse = ApiResponse.<String, List<CoursePrerequisiteDetailsResponse.CourseOption>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(options)
                .build();

        return ResponseEntity.ok(apiResponse);
    }
    
    @PutMapping("/courses/{courseId}/prerequisites")
    public ResponseEntity<?> updateCoursePrerequisites(@PathVariable Long courseId, @RequestBody UpdatePrerequisitesRequest request) {
        // Ensure the courseId in the path matches the request body
        request.setCourseId(courseId);
        
        prerequisiteCourseService.updateCoursePrerequisites(request);

        ApiResponse<String, Void> apiResponse = ApiResponse.<String, Void>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("Prerequisites updated successfully")
                .build();

        return ResponseEntity.ok(apiResponse);
    }
    
    @GetMapping("/validate/{courseId}/prerequisite/{prerequisiteCourseId}")
    public ResponseEntity<?> validatePrerequisiteAddition(@PathVariable Long courseId, @PathVariable Long prerequisiteCourseId) {
        boolean isValid = prerequisiteCourseService.validatePrerequisiteAddition(courseId, prerequisiteCourseId);

        ApiResponse<String, Boolean> apiResponse = ApiResponse.<String, Boolean>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(isValid)
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}