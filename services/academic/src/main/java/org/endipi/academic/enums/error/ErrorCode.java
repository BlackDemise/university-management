package org.endipi.academic.enums.error;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    /**
     * 400 Bad Request
     */
    COURSE_CANNOT_BE_ITS_OWN_PREREQUISITE(400, "Môn học không thể là môn học tiên quyết của chính nó!", HttpStatus.BAD_REQUEST),
    DUPLICATE_PREREQUISITE_RELATIONSHIP(400, "Môn học đã có quan hệ tiên quyết với môn học này!", HttpStatus.BAD_REQUEST),
    CIRCULAR_PREREQUISITE_DEPENDENCY(400, "Môn học không thể có quan hệ tiên quyết với chính nó!", HttpStatus.BAD_REQUEST),
    INVALID_REQUEST(400, "Yêu cầu không hợp lệ!", HttpStatus.BAD_REQUEST),
    INVALID_CREDITS_REQUIRED(400, "Số tín chỉ ít nhất là 1!", HttpStatus.BAD_REQUEST),
    INVALID_SEMESTER_RECOMMENDED(400, "Học kỳ đề nghị ít nhất là 0!", HttpStatus.BAD_REQUEST),
    INVALID_COURSE_TYPE(400, "Loại môn học không hợp lệ!", HttpStatus.BAD_REQUEST),
    INVALID_PREREQUISITE_ADDITION(400, "Không thể thêm môn học tiên quyết cho môn học này! Hãy kiểm tra lại.", HttpStatus.BAD_REQUEST),
    MAJOR_ID_NOT_PROVIDED(400, "Chưa cung cấp mã ngành!", HttpStatus.BAD_REQUEST),

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
    DEPARTMENT_NOT_FOUND(404, "Không tìm thấy khoa!", HttpStatus.NOT_FOUND),
    MAJOR_NOT_FOUND(404, "Không tìm thấy chuyên ngành!", HttpStatus.NOT_FOUND),
    COURSE_NOT_FOUND(404, "Không tìm thấy môn học!", HttpStatus.NOT_FOUND),
    TEACHER_NOT_FOUND(404, "Không tìm thấy giáo viên!", HttpStatus.NOT_FOUND),
    PROGRAM_CURRICULUM_NOT_FOUND(404, "Không tìm thấy chương trình đào tạo!", HttpStatus.NOT_FOUND),
    PREREQUISITE_COURSE_NOT_FOUND(404, "Không tìm thấy môn học tiên quyết!", HttpStatus.NOT_FOUND),
    DEPARTMENT_MEMBER_NOT_FOUND(404, "Không tìm thấy thành viên khoa!", HttpStatus.NOT_FOUND),
    USER_NOT_A_TEACHER(404, "Người dùng không phải là giáo viên!", HttpStatus.NOT_FOUND),
    TEACHER_VALIDATION_FAILED(404, "Không thể xác thực giáo viên!", HttpStatus.NOT_FOUND),
    DUPLICATE_DEPARTMENT_MEMBERSHIP(404, "Khoa đã có thành viên này!", HttpStatus.NOT_FOUND),

    /**
     * 500 Internal Server Error
     */
    GENERIC_ERROR(500, "Đã xảy ra lỗi trong quá trình xử lý yêu cầu! Hãy liên hệ với chúng tôi nếu điều này tiếp tục tái diễn.", HttpStatus.INTERNAL_SERVER_ERROR),
    USER_SERVICE_ERROR(500, "Dịch vụ người dùng hiện đang gặp vấn đề! Vui lòng thử lại sau.", HttpStatus.INTERNAL_SERVER_ERROR),

    /**
     * 503 Service Unavailable
     */
    USER_SERVICE_UNAVAILABLE(503, "Dịch vụ người dùng hiện đang gặp vấn đề! Vui lòng thử lại sau.", HttpStatus.SERVICE_UNAVAILABLE);
    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
