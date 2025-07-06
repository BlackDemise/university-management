package org.endipi.enrollment.dto.response;

import lombok.*;
import org.endipi.enrollment.dto.external.CourseResponse;
import org.endipi.enrollment.dto.external.TeacherResponse;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseOfferingResponse {
    private Long id;
    private Integer maxStudents;
    private Integer currentStudents;
    private LocalDateTime openTime;
    private LocalDateTime closeTime;
    private SemesterResponse semesterResponse;
    private CourseResponse courseResponse;
    private TeacherResponse teacherResponse;
}
