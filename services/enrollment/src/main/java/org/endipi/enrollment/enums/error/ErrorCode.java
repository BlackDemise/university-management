package org.endipi.enrollment.enums.error;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    /**
     * 400 Bad Request
     */
    INVALID_REQUEST(400, "Yêu cầu không hợp lệ!", HttpStatus.BAD_REQUEST),
    INVALID_SEMESTER_DATES(400, "Ngày bắt đầu phải trước ngày kết thúc!", HttpStatus.BAD_REQUEST),
    SEMESTER_HAS_COURSE_OFFERINGS(400, "Học kỳ này đang có lớp học! Không thể xóa!", HttpStatus.BAD_REQUEST),
    USER_NOT_A_TEACHER(400, "Người này không phải giảng viên!", HttpStatus.BAD_REQUEST),
    USER_NOT_A_STUDENT(400, "Người này không phải sinh viên!", HttpStatus.BAD_REQUEST),
    INVALID_DURATION(400, "Thời gian không hợp lệ! Thời gian bắt đầu phải trước thời gian kết thúc!", HttpStatus.BAD_REQUEST),

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
    COURSE_NOT_FOUND(404, "Không tìm thấy môn học!", HttpStatus.NOT_FOUND),
    SEMESTER_NOT_FOUND(404, "Không tìm thấy học kỳ!", HttpStatus.NOT_FOUND),
    COURSE_OFFERING_NOT_FOUND(404, "Không tìm thấy lớp học!", HttpStatus.NOT_FOUND),
    COURSE_REGISTRATION_NOT_FOUND(404, "Không tìm thấy đăng ký học!", HttpStatus.NOT_FOUND),
    TEACHER_NOT_FOUND(404, "Không tìm thấy giảng viên!", HttpStatus.NOT_FOUND),
    CLASSROOM_NOT_FOUND(404, "Không tìm thấy phòng học!", HttpStatus.NOT_FOUND),

    /**
     * 500 Internal Server Error
     */
    GENERIC_ERROR(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu! Hãy liên hệ với chúng tôi nếu điều này tiếp tục tái diễn.", HttpStatus.INTERNAL_SERVER_ERROR),
    TEACHER_VALIDATION_FAILED(500, "Đã xảy ra lỗi trong quá trình xác thực giảng viên!", HttpStatus.INTERNAL_SERVER_ERROR),
    CLASSROOM_VALIDATION_FAILED(500, "Đã xảy ra lỗi trong quá trình xác thực phòng học!", HttpStatus.INTERNAL_SERVER_ERROR),
    STUDENT_VALIDATION_FAILED(500, "Đã xảy ra lỗi trong quá trình xác thực sinh viên!", HttpStatus.INTERNAL_SERVER_ERROR),
    MAXIMUM_CAPACITY_REACHED(500, "Đã đạt đến số lượng tối đa cho lớp học này! Không thể đăng ký thêm.", HttpStatus.INTERNAL_SERVER_ERROR),
    REGISTRATION_CLOSED(500, "Đăng ký học đã đóng! Không thể đăng ký thêm.", HttpStatus.INTERNAL_SERVER_ERROR),
    COURSE_OFFERING_TRANSFER_NOT_ALLOWED(500, "Bạn không thể chuyển lớp học! Hãy liên hệ với phía quản lý để đăng ký lại.", HttpStatus.INTERNAL_SERVER_ERROR),

    /**
     * 503 Service Unavailable
     */
    USER_SERVICE_UNAVAILABLE(503, "Dịch vụ người dùng hiện đang gặp vấn đề! Vui lòng thử lại sau.", HttpStatus.SERVICE_UNAVAILABLE),
    COURSE_SERVICE_UNAVAILABLE(503, "Dịch vụ môn học hiện đang gặp vấn đề! Vui lòng thử lại sau.", HttpStatus.SERVICE_UNAVAILABLE),
    CLASSROOM_SERVICE_UNAVAILABLE(503, "Dịch vụ phòng học hiện đang gặp vấn đề! Vui lòng thử lại sau.", HttpStatus.SERVICE_UNAVAILABLE);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
