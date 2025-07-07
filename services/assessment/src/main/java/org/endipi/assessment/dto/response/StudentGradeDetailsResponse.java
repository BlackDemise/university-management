package org.endipi.assessment.dto.response;

import lombok.*;

import java.util.List;
import java.util.Map;

/**
 * Response DTO for student grade details grouped by course.
 * Used for optimized grade management UI.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentGradeDetailsResponse {
    private Long studentId;
    private String studentName;
    private String studentCode;
    private String studentEmail;
    
    // Grades grouped by course
    private Map<String, CourseGradeGroup> gradesByCourse;
    
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseGradeGroup {
        private Long courseId;
        private String courseCode;
        private String courseName;
        private String semesterName;
        private Long courseRegistrationId;
        private List<GradeResponse> grades;
    }
}
