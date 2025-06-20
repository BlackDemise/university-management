package org.endipi.facility.enums.classroom;

import lombok.Getter;

@Getter
public enum ClassroomType {
    LECTURE_HALL("Phòng học lý thuyết"),
    LAB("Phòng học thực hành");

    private final String classroomType;

    ClassroomType(String classroomType) {
        this.classroomType = classroomType;
    }
}
