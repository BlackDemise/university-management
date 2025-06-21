package org.endipi.assessment.enums.score;

import lombok.Getter;

@Getter
public enum ScoreType {
    MID_TERM("Điểm giữa kỳ"),
    FINAL("Điểm cuối kỳ"),
    LAB("Điểm thực hành"),
    PROJECT("Điểm đồ án"),
    EXAM("Điểm thi");

    private final String scoreType;

    ScoreType(String scoreType) {
        this.scoreType = scoreType;
    }
}
