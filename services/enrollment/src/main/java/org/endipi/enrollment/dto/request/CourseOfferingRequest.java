package org.endipi.enrollment.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseOfferingRequest {
    private Long id;
    private Integer maxStudents;
    private Integer currentStudents;
    private Long courseId;
    private Long semesterId;
    private Long teacherId;
    private Long classroomId;
}
