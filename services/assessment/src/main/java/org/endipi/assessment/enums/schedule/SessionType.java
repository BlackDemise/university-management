package org.endipi.assessment.enums.schedule;

import lombok.Getter;

@Getter
public enum SessionType {
    LECTURE("Tiết học lý thuyết"),
    LAB("Tiết học thực hành");

    private final String sessionType;

    SessionType(String sessionType) {
        this.sessionType = sessionType;
    }
}
