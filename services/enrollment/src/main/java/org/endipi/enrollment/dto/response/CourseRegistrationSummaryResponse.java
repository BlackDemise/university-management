package org.endipi.enrollment.dto.response;

import lombok.*;

/// Serves as a summary to CourseOffering registration (used in CourseRegistrationSummaryList.jsx)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseRegistrationSummaryResponse {
    private Long courseOfferingId;
    private Long courseId;
    private String courseCode;
    private String courseName;
    private String semesterName;
    private Long teacherId;
    private String teacherName;
    private Integer maxStudents;
    private Integer currentStudents;
    private String registrationStatus; // "OPEN", "CLOSED", "FULL"
}
