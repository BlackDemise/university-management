package org.endipi.assessment.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseSessionSummaryResponse {
    private Long courseOfferingId;
    private Long courseId;
    private String courseName;
    private String courseCode;
    private String semesterName;
    private String teacherName;
    private String teacherEmail;
    private Long totalSessionsRecorded;
}
