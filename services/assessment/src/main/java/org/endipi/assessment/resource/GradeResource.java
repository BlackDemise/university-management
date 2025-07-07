package org.endipi.assessment.resource;

import lombok.RequiredArgsConstructor;
import org.endipi.assessment.dto.request.GradeRequest;
import org.endipi.assessment.dto.response.ApiResponse;
import org.endipi.assessment.dto.response.GradeResponse;
import org.endipi.assessment.dto.response.StudentGradeDetailsResponse;
import org.endipi.assessment.service.GradeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/grade")
public class GradeResource {
    private final GradeService gradeService;

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        List<GradeResponse> responses = gradeService.findAll();

        ApiResponse<String, List<GradeResponse>> apiResponse =
                ApiResponse.<String, List<GradeResponse>>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(responses)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        GradeResponse response = gradeService.findById(id);

        ApiResponse<String, GradeResponse> apiResponse =
                ApiResponse.<String, GradeResponse>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(response)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody GradeRequest request) {
        GradeResponse response = gradeService.saveWithRetry(request);

        ApiResponse<String, GradeResponse> apiResponse =
                ApiResponse.<String, GradeResponse>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(response)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        gradeService.deleteById(id);

        ApiResponse<String, Void> apiResponse = ApiResponse.<String, Void>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    // S2S ENDPOINT -> no ApiResponse wrapper for clarity
    @GetMapping("/s2s/student/{studentId}/details")
    public ResponseEntity<StudentGradeDetailsResponse> getStudentGradeDetails(@PathVariable Long studentId) {
        StudentGradeDetailsResponse response = gradeService.getStudentGradeDetails(studentId);
        return ResponseEntity.ok(response);
    }

    // S2S ENDPOINT -> no ApiResponse wrapper for clarity
    @GetMapping("/s2s/course-registration/{courseRegistrationId}")
    public ResponseEntity<List<GradeResponse>> getGradesByCourseRegistrationId(@PathVariable Long courseRegistrationId) {
        List<GradeResponse> response = gradeService.getGradesByCourseRegistrationId(courseRegistrationId);
        return ResponseEntity.ok(response);
    }
}