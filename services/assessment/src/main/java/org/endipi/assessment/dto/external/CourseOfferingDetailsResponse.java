package org.endipi.assessment.dto.external;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseOfferingDetailsResponse {
    private Long id;
    private Long courseId;
    private String semesterName;
    private Long teacherId;
    private String teacherName;
    private String teacherEmail;
    private Long classroomId;
    private Integer maxStudents;
    private Integer currentStudents;
}
