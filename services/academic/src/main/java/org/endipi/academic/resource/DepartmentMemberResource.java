package org.endipi.academic.resource;

import lombok.RequiredArgsConstructor;
import org.endipi.academic.dto.request.DepartmentMemberRequest;
import org.endipi.academic.dto.response.ApiResponse;
import org.endipi.academic.dto.response.DepartmentMemberDetailResponse;
import org.endipi.academic.dto.response.DepartmentMemberResponse;
import org.endipi.academic.dto.response.DepartmentSummaryResponse;
import org.endipi.academic.dto.response.MemberSelectionResponse;
import org.endipi.academic.service.DepartmentMemberService;
import org.endipi.academic.util.EnumUtil;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/department-member")
public class DepartmentMemberResource {
    private final DepartmentMemberService departmentMemberService;
    private final EnumUtil enumUtil;

    @GetMapping("/enum/department-member-type")
    public ResponseEntity<?> getDepartmentMemberTypeEnum() {
        Map<String, String> departmentMemberTypes = enumUtil.getDepartmentMemberTypes();

        ApiResponse<String, Map<String, String>> apiResponse = ApiResponse.<String, Map<String, String>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(departmentMemberTypes)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/teachers/available")
    public ResponseEntity<?> getAvailableTeachers() {
        List<MemberSelectionResponse> teachers = departmentMemberService.getAvailableTeachers();

        ApiResponse<String, List<MemberSelectionResponse>> apiResponse = ApiResponse.<String, List<MemberSelectionResponse>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(teachers)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/department/{departmentId}/details")
    public ResponseEntity<?> getDepartmentDetails(@PathVariable Long departmentId) {
        List<DepartmentMemberDetailResponse> departmentDetails = departmentMemberService.getDepartmentDetails(departmentId);

        ApiResponse<String, List<DepartmentMemberDetailResponse>> apiResponse = ApiResponse.<String, List<DepartmentMemberDetailResponse>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(departmentDetails)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/department/{departmentId}/delete-all")
    public ResponseEntity<?> deleteAllByDepartmentId(@PathVariable Long departmentId) {
        departmentMemberService.deleteAllByDepartmentId(departmentId);

        ApiResponse<String, Void> apiResponse = ApiResponse.<String, Void>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .build();

        return ResponseEntity.ok(apiResponse);
    }

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

    @GetMapping("/department-summary")
    public ResponseEntity<?> findDepartmentSummaryWithPaging(@RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size,
                                                             @RequestParam(defaultValue = "department.id,asc") String sort,
                                                             @RequestParam(required = false) String searchValue,
                                                             // searchCriterion will be a placeholder here for later migration
                                                             @RequestParam(defaultValue = "departmentName") String searchCriterion) {
        Page<DepartmentSummaryResponse> departmentSummary = departmentMemberService.findDepartmentSummaryWithPaging(page, size, sort, searchValue, searchCriterion);

        ApiResponse<String, Page<DepartmentSummaryResponse>> apiResponse = ApiResponse.<String, Page<DepartmentSummaryResponse>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(departmentSummary)
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