package org.endipi.user.resource;

import lombok.RequiredArgsConstructor;
import org.endipi.user.dto.request.UserRequest;
import org.endipi.user.dto.response.ApiResponse;
import org.endipi.user.dto.response.TeacherValidationResponse;
import org.endipi.user.dto.response.UserResponse;
import org.endipi.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<?> save(@RequestBody UserRequest userRequest) {
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

    // S2S VALIDATION ENDPOINT -> no ApiResponse wrapper
    @GetMapping("/teachers/{teacherId}/validate")
    public ResponseEntity<TeacherValidationResponse> validateTeacher(@PathVariable Long teacherId) {
        TeacherValidationResponse validation = userService.validateTeacher(teacherId);

        return ResponseEntity.ok(validation);
    }
}
