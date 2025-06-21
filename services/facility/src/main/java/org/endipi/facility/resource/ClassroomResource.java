package org.endipi.facility.resource;

import lombok.RequiredArgsConstructor;
import org.endipi.facility.dto.external.ClassroomValidationResponse;
import org.endipi.facility.dto.request.ClassroomRequest;
import org.endipi.facility.dto.response.ApiResponse;
import org.endipi.facility.dto.response.ClassroomResponse;
import org.endipi.facility.service.ClassroomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/classroom")
public class ClassroomResource {
    private final ClassroomService classroomService;

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        List<ClassroomResponse> classroomResponses = classroomService.findAll();

        ApiResponse<String, List<ClassroomResponse>> apiResponse =
                ApiResponse.<String, List<ClassroomResponse>>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(classroomResponses)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        ClassroomResponse classroomResponse = classroomService.findById(id);

        ApiResponse<String, ClassroomResponse> apiResponse =
                ApiResponse.<String, ClassroomResponse>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(classroomResponse)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody ClassroomRequest classroomRequest) {
        ClassroomResponse classroomResponse = classroomService.saveWithRetry(classroomRequest);

        ApiResponse<String, ClassroomResponse> apiResponse =
                ApiResponse.<String, ClassroomResponse>builder()
                        .timestamp(System.currentTimeMillis())
                        .statusCode(HttpStatus.OK.value())
                        .message("OK")
                        .result(classroomResponse)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        classroomService.deleteById(id);

        ApiResponse<String, Void> apiResponse = ApiResponse.<String, Void>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    // S2S ENDPOINT -> no ApiResponse wrapper for clarity
    @GetMapping("/validate/{classroomId}")
    public ResponseEntity<ClassroomValidationResponse> validateClassroom(@PathVariable Long classroomId) {
        ClassroomValidationResponse isValid = classroomService.validateClassroom(classroomId);

        return ResponseEntity.ok(isValid);
    }
}