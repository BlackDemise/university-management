package org.endipi.user.enums.student;

import lombok.Getter;

@Getter
public enum StudentStatus {
    ACTIVE("Đang học"),
    SUSPENDED("Bảo lưu"),
    GRADUATED("Đã tốt nghiệp");

    private final String studentStatus;

    StudentStatus(String studentStatus) {
        this.studentStatus = studentStatus;
    }
}
