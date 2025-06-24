package org.endipi.auth.enums.error;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    /**
     * 400 Bad Request
     */
    INVALID_LOGIN_REQUEST(400, "Không đủ thông tin đăng nhập!", HttpStatus.BAD_REQUEST),

    /**
     * 404 Not Found
     */
    USER_NOT_FOUND(404, "Không tìm thấy người dùng!", HttpStatus.NOT_FOUND);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
