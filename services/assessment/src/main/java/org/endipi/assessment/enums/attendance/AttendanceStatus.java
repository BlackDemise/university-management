package org.endipi.assessment.enums.attendance;

import lombok.Getter;

@Getter
public enum AttendanceStatus {
    PRESENT("Có mặt"),
    ABSENT("Vắng mặt");

    private final String attendanceStatus;

    AttendanceStatus(String attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }
}
