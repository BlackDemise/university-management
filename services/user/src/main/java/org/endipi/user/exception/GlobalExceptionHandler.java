package org.endipi.user.exception;

import lombok.extern.slf4j.Slf4j;
import org.endipi.user.dto.response.ApiResponse;
import org.endipi.user.enums.error.ErrorCode;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = ApplicationException.class)
    ResponseEntity<?> handleApplicationException(ApplicationException ae) {
        ErrorCode errorCode = ae.getErrorCode();
        ApiResponse<String, Object> apiResponse = ApiResponse.<String, Object>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(errorCode.getHttpStatus().value())
                .message(errorCode.getMessage())
                .build();

        return ResponseEntity.status(errorCode.getHttpStatus()).body(apiResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        FieldError::getDefaultMessage,
                        (existing, replacement) -> existing
                ));

        ApiResponse<String, Object> apiResponse = ApiResponse.<String, Object>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .message("Tồn tại thông tin không hợp lệ!")
                .result(errors)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
    }

    @ExceptionHandler(ValidationException.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public ResponseEntity<?> handleCustomValidationException(ValidationException ex) {
        ApiResponse<String, Object> apiResponse = ApiResponse.<String, Object>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .message("Tồn tại thông tin không hợp lệ!")
                .result(ex.getFieldErrors())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
    }

    @ExceptionHandler(value = AuthenticationException.class)
    @ResponseStatus(value = HttpStatus.UNAUTHORIZED)
    ResponseEntity<?> handleAuthenticationException(AuthenticationException ae) {
        ApiResponse<String, Object> apiResponse = ApiResponse.<String, Object>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.UNAUTHORIZED.value())
                .message("Sai tài khoản hoặc mật khẩu!")
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiResponse);
    }

    @ExceptionHandler(value = {
            org.hibernate.StaleObjectStateException.class,
            org.springframework.orm.ObjectOptimisticLockingFailureException.class
    })
    public ResponseEntity<?> handleOptimisticLockingFailure(Exception ex) {
        ApiResponse<String, Object> apiResponse = ApiResponse.<String, Object>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.CONFLICT.value())
                .message("Đã xảy ra lỗi trong quá trình thực hiện yêu cầu! Vui lòng thử lại sau.")
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(apiResponse);
    }

    // Add to your GlobalExceptionHandler
    @ExceptionHandler({
            SQLIntegrityConstraintViolationException.class,
            DataIntegrityViolationException.class
    })
    public ResponseEntity<?> handleDatabaseConstraintViolation(Exception ex) {
        log.error("Database constraint violation: {}", ex.getMessage(), ex);

        String message = "Tồn tại thông tin không hợp lệ!";
        Map<String, String> fieldErrors = new java.util.HashMap<>();

        // Smart message parsing based on constraint violation
        String errorDetails = ex.getMessage().toLowerCase();

        if (errorDetails.contains("duplicate") || errorDetails.contains("unique")) {
            if (errorDetails.contains("email") || errorDetails.contains("uk_email")) {
                fieldErrors.put("email", "Email này đã được sử dụng! Vui lòng sử dụng email khác.");
            } else if (errorDetails.contains("teacher_code") || errorDetails.contains("teachercode")) {
                fieldErrors.put("teacherCode", "Mã giảng viên đã được sử dụng! Vui lòng sử dụng mã khác.");
            } else if (errorDetails.contains("student_code") || errorDetails.contains("studentcode")) {
                fieldErrors.put("studentCode", "Mã sinh viên đã được sử dụng! Vui lòng sử dụng mã khác.");
            } else {
                message = "Thông tin này đã được sử dụng! Vui lòng kiểm tra lại.";
            }
        } else if (errorDetails.contains("foreign key") || errorDetails.contains("cannot add or update")) {
            message = "Dữ liệu tham chiếu không hợp lệ! Vui lòng kiểm tra lại thông tin.";
        } else if (errorDetails.contains("not null") || errorDetails.contains("cannot be null")) {
            message = "Thông tin bắt buộc bị thiếu! Vui lòng điền đầy đủ thông tin.";
        }

        // If we have field-specific errors, return them in the result
        Object result = fieldErrors.isEmpty() ? null : fieldErrors;

        ApiResponse<String, Object> apiResponse = ApiResponse.<String, Object>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .message(message)
                .result(result)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
    }
}
