package org.endipi.assessment.enums.session;

import lombok.Getter;

@Getter
public enum SessionType {
    LECTURE("Tiết học lý thuyết"),
    LAB("Tiết học thực hành"),
    EXAM("Thời gian thi");

    private final String sessionType;

    SessionType(String sessionType) {
        this.sessionType = sessionType;
    }
}
