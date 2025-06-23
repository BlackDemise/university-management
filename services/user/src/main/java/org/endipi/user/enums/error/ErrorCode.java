package org.endipi.user.enums.error;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    /**
     * 400 Bad Request
     */
    INVALID_REQUEST(400, "Yêu cầu không hợp lệ! Vui lòng kiểm tra lại thông tin đã nhập.", HttpStatus.BAD_REQUEST),
    INCORRECT_OLD_PASSWORD(400, "Mật khẩu cũ không chính xác!", HttpStatus.BAD_REQUEST),
    UNMATCHED_PASSWORD(400, "Mật khẩu mới không khớp!", HttpStatus.BAD_REQUEST),
    INVALID_LOGIN_REQUEST(400, "Không đủ thông tin đăng nhập!", HttpStatus.BAD_REQUEST),
    SAME_PASSWORD(400, "Mật khẩu mới không được trùng với mật khẩu cũ!", HttpStatus.BAD_REQUEST),

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
    DEPARTMENT_NOT_FOUND(404, "Không tìm thấy khoa!", HttpStatus.NOT_FOUND),
    MAJOR_NOT_FOUND(404, "Không tìm thấy chuyên ngành!", HttpStatus.NOT_FOUND),
    COURSE_NOT_FOUND(404, "Không tìm thấy môn học!", HttpStatus.NOT_FOUND),

    /**
     * 409 Conflict
     */
    CONFLICT_OPERATION(409, "Đã xảy ra lỗi trong quá trình thực hiện yêu cầu! Vui lòng thử lại sau.", HttpStatus.CONFLICT),

    /**
     * 500 Internal Server Error
     */
    GENERIC_ERROR(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu! Hãy liên hệ với chúng tôi nếu điều này tiếp tục tái diễn.", HttpStatus.INTERNAL_SERVER_ERROR),
    REGISTER_ERROR(500, "Đã xảy ra lỗi trong quá trình đăng ký!", HttpStatus.INTERNAL_SERVER_ERROR),

    /**
     * 503 Service Unavailable
     */
    ACADEMIC_SERVICE_UNAVAILABLE(503, "Dịch vụ khoa hiện không khả dụng! Vui lòng thử lại sau.", HttpStatus.SERVICE_UNAVAILABLE);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
