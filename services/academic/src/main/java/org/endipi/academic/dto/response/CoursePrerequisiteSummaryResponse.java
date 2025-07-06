package org.endipi.academic.dto.response;

import lombok.*;

/// Serves PrerequisiteCourseList.jsx
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoursePrerequisiteSummaryResponse {
    private Long courseId;
    private String courseCode;
    private String courseName;
    private Long numberOfPrequisiteCourses;
    private Boolean hasCircularDependency; // Warning indicator
    private Boolean isPrequisiteForOtherCourses; // Show if this course is a prerequisite for other courses
    private String departmentName; // Show the department name of the course
}
