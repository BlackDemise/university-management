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
     * 401 Unauthorized
     */
    USER_NOT_AUTHENTICATED(401, "Người dùng chưa đăng nhập! Hãy đăng nhập để tiếp tục!", HttpStatus.UNAUTHORIZED),

    /**
     * 403 Forbidden
     */
    USER_NOT_AUTHORIZED(403, "Người dùng không có quyền thực hiện hành động này!", HttpStatus.FORBIDDEN),

    /**
     * 404 Not Found
     */
    USER_NOT_FOUND(404, "Không tìm thấy người dùng!", HttpStatus.NOT_FOUND),

    /**
     * 500 Internal Server Error
     */
    GENERIC_ERROR(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu! Hãy liên hệ với chúng tôi nếu điều này tiếp tục tái diễn.", HttpStatus.INTERNAL_SERVER_ERROR);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
