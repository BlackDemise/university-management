package org.endipi.enrollment.resource;

import lombok.RequiredArgsConstructor;
import org.endipi.enrollment.dto.request.CourseRegistrationRequest;
import org.endipi.enrollment.dto.response.ApiResponse;
import org.endipi.enrollment.dto.response.CourseRegistrationDetailsResponse;
import org.endipi.enrollment.dto.response.CourseRegistrationResponse;
import org.endipi.enrollment.dto.response.CourseRegistrationSummaryResponse;
import org.endipi.enrollment.service.CourseRegistrationService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

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

    @GetMapping("/all/summary/page")
    public ResponseEntity<?> findCourseRegistrationSummariesWithPaging(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "cr.courseOffering.id,asc") String sort,
            @RequestParam(required = false) String searchValue,
            @RequestParam(required = false) String searchCriterion) {

        Page<CourseRegistrationSummaryResponse> response = courseRegistrationService.findCourseRegistrationSummariesWithPaging(page, size, sort, searchValue, searchCriterion);

        ApiResponse<String, Page<CourseRegistrationSummaryResponse>> apiResponse =
                ApiResponse.<String, Page<CourseRegistrationSummaryResponse>>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(response)
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

    @GetMapping("/by-course-offering/{courseOfferingId}")
    public ResponseEntity<?> findByCourseOfferingId(@PathVariable Long courseOfferingId) {
        List<CourseRegistrationResponse> responses = courseRegistrationService.findByCourseOfferingId(courseOfferingId);

        ApiResponse<String, List<CourseRegistrationResponse>> apiResponse =
                ApiResponse.<String, List<CourseRegistrationResponse>>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(responses)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/by-course-offering/{courseOfferingId}/page")
    public ResponseEntity<?> findByCourseOfferingIdWithPaging(
            @PathVariable Long courseOfferingId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "registrationDate,desc") String sort) {

        Page<CourseRegistrationResponse> response = courseRegistrationService.findByCourseOfferingIdWithPaging(courseOfferingId, page, size, sort);

        ApiResponse<String, Page<CourseRegistrationResponse>> apiResponse =
                ApiResponse.<String, Page<CourseRegistrationResponse>>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(response)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    // S2S ENDPOINT -> no ApiResponse wrapper for clarity
    @GetMapping("/{courseRegistrationId}/validate")
    public ResponseEntity<Boolean> validateCourseRegistration(@PathVariable Long courseRegistrationId) {
        return ResponseEntity.ok(courseRegistrationService.validateCourseRegistration(courseRegistrationId));
    }

    // S2S ENDPOINT -> no ApiResponse wrapper for clarity
    @GetMapping("/s2s/batch-details")
    public ResponseEntity<Map<Long, CourseRegistrationDetailsResponse>> getCourseRegistrationDetailsByIds(
            @RequestParam Set<Long> courseRegistrationIds) {
        Map<Long, CourseRegistrationDetailsResponse> details =
                courseRegistrationService.getCourseRegistrationDetailsByIds(courseRegistrationIds);
        return ResponseEntity.ok(details);
    }

    // S2S ENDPOINT -> no ApiResponse wrapper for clarity
    @GetMapping("/s2s/student/{studentId}")
    public ResponseEntity<List<CourseRegistrationDetailsResponse>> getCourseRegistrationsByStudentId(
            @PathVariable Long studentId) {
        List<CourseRegistrationDetailsResponse> registrations =
                courseRegistrationService.getCourseRegistrationsByStudentId(studentId);
        return ResponseEntity.ok(registrations);
    }
}