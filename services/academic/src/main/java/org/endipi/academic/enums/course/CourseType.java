package org.endipi.academic.enums.course;

import lombok.Getter;

@Getter
public enum CourseType {
    GENERAL("Môn chung"),
    SPECIALIZED("Môn chuyên ngành"),
    ELECTIVE("Môn tự chọn");

    private final String courseType;

    CourseType(String courseType) {
        this.courseType = courseType;
    }
}
