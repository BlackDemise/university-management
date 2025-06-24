package org.endipi.assessment.enums.error;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    /**
     * 400 Bad Request
     */
    INVALID_REQUEST(400, "Yêu cầu không hợp lệ!", HttpStatus.BAD_REQUEST),
    INVALID_SCORE_VALUE(400, "Điểm không hợp lệ! Điểm phải nằm trong khoảng từ 0 đến 10.", HttpStatus.BAD_REQUEST),
    INVALID_SCHEDULE_TIME(400, "Thời gian biểu không hợp lệ! Thời gian bắt đầu phải trước thời gian kết thúc.", HttpStatus.BAD_REQUEST),
    USER_NOT_A_STUDENT(400, "Người dùng không phải là sinh viên!", HttpStatus.BAD_REQUEST),

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
    TEACHER_NOT_FOUND(404, "Không tìm thấy giáo viên!", HttpStatus.NOT_FOUND),
    GRADE_NOT_FOUND(404, "Không tìm thấy điểm!", HttpStatus.NOT_FOUND),
    ATTENDANCE_NOT_FOUND(404, "Không tìm thấy điểm danh!", HttpStatus.NOT_FOUND),
    SCHEDULE_NOT_FOUND(404, "Không tìm thấy thời gian biểu!", HttpStatus.NOT_FOUND),
    COURSE_REGISTRATION_NOT_FOUND(404, "Không tìm thấy đăng ký học!", HttpStatus.NOT_FOUND),
    COURSE_OFFERING_NOT_FOUND(404, "Không tìm thấy khóa học!", HttpStatus.NOT_FOUND),
    FACILITY_NOT_FOUND(404, "Không tìm thấy cơ sở vật chất!", HttpStatus.NOT_FOUND),
    CLASSROOM_NOT_FOUND(404, "Không tìm thấy phòng học!", HttpStatus.NOT_FOUND),

    /**
     * 500 Internal Server Error
     */
    GENERIC_ERROR(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu! Hãy liên hệ với chúng tôi nếu điều này tiếp tục tái diễn.", HttpStatus.INTERNAL_SERVER_ERROR),
    USER_SERVICE_ERROR(500, "Dịch vụ người dùng hiện đang gặp vấn đề! Vui lòng thử lại sau.", HttpStatus.INTERNAL_SERVER_ERROR),
    SCHEDULE_HAS_ATTENDANCE_RECORDS(500, "Không thể xóa thời gian biểu vì nó có điểm danh liên quan!", HttpStatus.INTERNAL_SERVER_ERROR),
    ATTENDANCE_TIME_WINDOW_EXPIRED(500, "Thời gian điểm danh đã đóng! Không thể thực hiện điểm danh.", HttpStatus.INTERNAL_SERVER_ERROR),
    DUPLICATE_ATTENDANCE_RECORD(500, "Đã có điểm danh cho sinh viên này trong thời gian biểu này!", HttpStatus.INTERNAL_SERVER_ERROR),
    ENROLLMENT_SERVICE_ERROR(500, "Dịch vụ đăng ký hiện đang gặp vấn đề! Vui lòng thử lại sau.", HttpStatus.INTERNAL_SERVER_ERROR),
    DUPLICATE_GRADE_ENTRY(500, "Sinh viên này đã có đầu điểm này!", HttpStatus.INTERNAL_SERVER_ERROR),
    FACILITY_SERVICE_ERROR(500, "Dịch vụ cơ sở vật chất hiện đang gặp vấn đề! Vui lòng thử lại sau.", HttpStatus.INTERNAL_SERVER_ERROR),

    /**
     * 503 Service Unavailable
     */
    USER_SERVICE_UNAVAILABLE(503, "Dịch vụ người dùng hiện đang gặp vấn đề! Vui lòng thử lại sau.", HttpStatus.SERVICE_UNAVAILABLE),
    ENROLLMENT_SERVICE_UNAVAILABLE(503, "Dịch vụ đăng ký hiện đang gặp vấn đề! Vui lòng thử lại sau.", HttpStatus.SERVICE_UNAVAILABLE),
    FACILITY_SERVICE_UNAVAILABLE(503, "Dịch vụ cơ sở vật chất hiện đang gặp vấn đề! Vui lòng thử lại sau.", HttpStatus.SERVICE_UNAVAILABLE);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
