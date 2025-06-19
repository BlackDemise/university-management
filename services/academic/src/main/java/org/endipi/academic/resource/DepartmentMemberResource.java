package org.endipi.academic.resource;

import lombok.RequiredArgsConstructor;
import org.endipi.academic.dto.request.DepartmentMemberRequest;
import org.endipi.academic.dto.response.ApiResponse;
import org.endipi.academic.dto.response.DepartmentMemberResponse;
import org.endipi.academic.service.DepartmentMemberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/department-member")
public class DepartmentMemberResource {
    private final DepartmentMemberService departmentMemberService;

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        List<DepartmentMemberResponse> departmentMemberResponses = departmentMemberService.findAll();

        ApiResponse<String, List<DepartmentMemberResponse>> apiResponse = ApiResponse.<String, List<DepartmentMemberResponse>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(departmentMemberResponses)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        DepartmentMemberResponse departmentMemberResponse = departmentMemberService.findById(id);

        ApiResponse<String, DepartmentMemberResponse> apiResponse = ApiResponse.<String, DepartmentMemberResponse>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(departmentMemberResponse)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody DepartmentMemberRequest departmentMemberRequest) {
        DepartmentMemberResponse departmentMemberResponse = departmentMemberService.saveWithRetry(departmentMemberRequest);

        ApiResponse<String, DepartmentMemberResponse> apiResponse = ApiResponse.<String, DepartmentMemberResponse>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(departmentMemberResponse)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/{departmentMemberId}")
    public ResponseEntity<?> deleteById(@PathVariable Long departmentMemberId) {
        departmentMemberService.deleteById(departmentMemberId);

        ApiResponse<String, Void> apiResponse = ApiResponse.<String, Void>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<?> findByDepartmentId(@PathVariable Long departmentId) {
        List<DepartmentMemberResponse> departmentMembers = departmentMemberService.findByDepartmentId(departmentId);

        ApiResponse<String, List<DepartmentMemberResponse>> apiResponse = ApiResponse.<String, List<DepartmentMemberResponse>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(departmentMembers)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> findByTeacherId(@PathVariable Long teacherId) {
        List<DepartmentMemberResponse> teacherMemberships = departmentMemberService.findByTeacherId(teacherId);

        ApiResponse<String, List<DepartmentMemberResponse>> apiResponse = ApiResponse.<String, List<DepartmentMemberResponse>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(teacherMemberships)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/teacher/{teacherId}/remove-all")
    public ResponseEntity<?> removeAllByTeacherId(@PathVariable Long teacherId) {
        departmentMemberService.deleteAllByTeacherId(teacherId);

        ApiResponse<String, Void> apiResponse = ApiResponse.<String, Void>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}