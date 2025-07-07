package org.endipi.user.resource;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.endipi.user.dto.request.UserRequest;
import org.endipi.user.dto.response.ApiResponse;
import org.endipi.user.dto.response.StudentValidationResponse;
import org.endipi.user.dto.response.TeacherValidationResponse;
import org.endipi.user.dto.response.UserResponse;
import org.endipi.user.dto.s2s.S2SStudentResponse;
import org.endipi.user.dto.s2s.S2STeacherResponse;
import org.endipi.user.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class UserResource {
    private final UserService userService;

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        List<UserResponse> userResponses = userService.findAll();

        ApiResponse<String, List<UserResponse>> apiResponse = ApiResponse.<String, List<UserResponse>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(userResponses)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/all/page")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String sort,
            @RequestParam(required = false) String searchValue,
            @RequestParam(defaultValue = "fullName") String searchCriterion
    ) {
        Page<UserResponse> response = userService.findBySearchingCriterion(page, size, sort, searchValue, searchCriterion);

        ApiResponse<String, Page<UserResponse>> apiResponse = ApiResponse.<String, Page<UserResponse>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(response)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        UserResponse userResponse = userService.findById(id);

        ApiResponse<String, UserResponse> apiResponse = ApiResponse.<String, UserResponse>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(userResponse)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@Valid @RequestBody UserRequest userRequest) {
        UserResponse userResponse = userService.saveWithRetry(userRequest);

        ApiResponse<String, UserResponse> apiResponse = ApiResponse.<String, UserResponse>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(userResponse)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<?> deleteById(@PathVariable Long userId) {
        userService.deleteById(userId);

        ApiResponse<String, Void> apiResponse = ApiResponse.<String, Void>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    // S2S ENDPOINT -> no ApiResponse wrapper for clarity
    @GetMapping("/teachers/{teacherId}/validate")
    public ResponseEntity<TeacherValidationResponse> validateTeacher(@PathVariable Long teacherId) {
        TeacherValidationResponse validation = userService.validateTeacher(teacherId);

        return ResponseEntity.ok(validation);
    }

    // S2S ENDPOINT -> no ApiResponse wrapper for clarity
    @GetMapping("/teachers/all")
    public ResponseEntity<?> getAllTeachers() {
        List<S2STeacherResponse> teachers = userService.findAllTeachers();

        return ResponseEntity.ok(teachers);
    }

    // S2S ENDPOINT -> no ApiResponse wrapper for clarity
    @GetMapping("/teachers/{teacherId}/details")
    public ResponseEntity<?> getTeacherDetails(@PathVariable Long teacherId) {
        S2STeacherResponse teacherDetails = userService.findByTeacherId(teacherId);

        return ResponseEntity.ok(teacherDetails);
    }

    // S2S ENDPOINT -> no ApiResponse wrapper for clarity
    @GetMapping("/students/{studentId}/validate")
    public ResponseEntity<StudentValidationResponse> validateStudent(@PathVariable Long studentId) {
        StudentValidationResponse validation = userService.validateStudent(studentId);

        return ResponseEntity.ok(validation);
    }

    // S2S ENDPOINT -> no ApiResponse wrapper for clarity
    @GetMapping("/s2s/id-name")
    public Map<Long, String> getTeacherNamesByIds(@RequestParam Set<Long> teacherIds) {
        return userService.getTeacherNamesByIds(teacherIds);
    }

    // S2S ENDPOINT -> no ApiResponse wrapper for clarity
    @GetMapping("/students/all")
    public ResponseEntity<List<S2SStudentResponse>> getAllStudents() {
        List<S2SStudentResponse> students = userService.findAllStudents();

        return ResponseEntity.ok(students);
    }

    // S2S ENDPOINT -> no ApiResponse wrapper for clarity
    @GetMapping("/students/{studentId}/details")
    public ResponseEntity<S2SStudentResponse> getStudentDetails(@PathVariable Long studentId) {
        S2SStudentResponse studentDetails = userService.findByStudentId(studentId);

        return ResponseEntity.ok(studentDetails);
    }

    // S2S ENDPOINT -> no ApiResponse wrapper for clarity
    @GetMapping("/s2s/students/id-name")
    public Map<Long, String> getStudentNamesByIds(@RequestParam Set<Long> studentIds) {
        return userService.getStudentNamesByIds(studentIds);
    }

    // S2S ENDPOINT -> no ApiResponse wrapper for clarity
    @GetMapping("/s2s/teacher/batch-details")
    public Map<Long, TeacherValidationResponse> getTeacherDetailsByIds(@RequestParam Set<Long> teacherIds) {
        return userService.getTeacherDetailsByIds(teacherIds);
    }
}
