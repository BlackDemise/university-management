package org.endipi.academic.resource;

import lombok.RequiredArgsConstructor;
import org.endipi.academic.dto.request.DepartmentRequest;
import org.endipi.academic.dto.response.ApiResponse;
import org.endipi.academic.dto.response.DepartmentResponse;
import org.endipi.academic.service.DepartmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/department")
@RequiredArgsConstructor
public class DepartmentResource {
    private final DepartmentService departmentService;

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        List<DepartmentResponse> departmentResponses = departmentService.findAll();

        ApiResponse<String, List<DepartmentResponse>> apiResponse = ApiResponse.<String, List<DepartmentResponse>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(departmentResponses)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        DepartmentResponse departmentResponse = departmentService.findById(id);

        ApiResponse<String, DepartmentResponse> apiResponse = ApiResponse.<String, DepartmentResponse>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(departmentResponse)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody DepartmentRequest departmentRequest) {
        DepartmentResponse departmentResponse = departmentService.saveWithRetry(departmentRequest);

        ApiResponse<String, DepartmentResponse> apiResponse = ApiResponse.<String, DepartmentResponse>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(departmentResponse)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        departmentService.deleteById(id);

        ApiResponse<String, Void> apiResponse = ApiResponse.<String, Void>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
