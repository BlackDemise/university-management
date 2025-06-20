package org.endipi.facility.resource;

import lombok.RequiredArgsConstructor;
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
@RequestMapping("/api/v1/facility")
public class ClassroomResource {
    private final ClassroomService classroomService;

    @GetMapping("/classrooms/all")
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

    @GetMapping("/classrooms/details/{id}")
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

    @PostMapping("/classrooms/save")
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

    @DeleteMapping("/classrooms/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        classroomService.deleteById(id);

        ApiResponse<String, Void> apiResponse = ApiResponse.<String, Void>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}