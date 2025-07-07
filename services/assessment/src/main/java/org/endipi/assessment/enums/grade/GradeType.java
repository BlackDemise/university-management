package org.endipi.assessment.enums.grade;

import lombok.Getter;

@Getter
public enum GradeType {
    MID_TERM("Điểm giữa kỳ"),
    FINAL("Điểm cuối kỳ"),
    LAB("Điểm thực hành"),
    PROJECT("Điểm đồ án"),
    ASSIGNMENT("Điểm bài tập"),
    QUIZ("Điểm trắc nghiệm"),
    EXAM("Điểm thi");

    private final String gradeType;

    GradeType(String gradeType) {
        this.gradeType = gradeType;
    }
}
