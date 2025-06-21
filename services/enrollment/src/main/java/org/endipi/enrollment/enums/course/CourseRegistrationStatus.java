package org.endipi.enrollment.enums.course;

import lombok.Getter;

@Getter
public enum CourseRegistrationStatus {
    REGISTERED("Đã đăng ký"),
    PROCESSING("Đang xử lý"),
    CANCELLED("Đã hủy");

    private final String courseRegistrationStatus;

    CourseRegistrationStatus(String courseRegistrationStatus) {
        this.courseRegistrationStatus = courseRegistrationStatus;
    }
}