package org.endipi.enrollment.dto.external;

import lombok.*;

/// Load all teachers in CourseOfferingUpdate.jsx
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherResponse {
    private Long teacherId;
    private String teacherName;
    private String teacherCode;
    private String teacherEmail;
}
