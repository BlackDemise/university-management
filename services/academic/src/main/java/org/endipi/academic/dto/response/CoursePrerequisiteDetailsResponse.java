package org.endipi.academic.dto.response;

import lombok.*;

import java.util.List;

/// Serves PrerequisiteCourseDetails.jsx
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoursePrerequisiteDetailsResponse {
    private CourseInfo course;
    private List<PrerequisiteCourseInfo> prerequisites;
    private List<PrerequisiteCourseInfo> requiredByOthers;
    private List<CourseOption> availableAsPrerequisites;
    private List<String> circularDependencyWarnings;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseInfo {
        private Long courseId;
        private String courseCode;
        private String courseName;
        private Integer creditsTheory;
        private Integer creditsPractical;
        private String departmentName;
        private String courseType;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrerequisiteCourseInfo {
        private Long courseId;
        private String courseCode;
        private String courseName;
        private Integer totalCredits;
        private Boolean canBeRemoved;
        private String departmentName;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseOption {
        private Long courseId;
        private String courseCode;
        private String courseName;
        private String departmentName;
        private Integer totalCredits;
    }
} 