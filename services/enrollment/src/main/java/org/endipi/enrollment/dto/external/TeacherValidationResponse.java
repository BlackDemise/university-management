package org.endipi.enrollment.dto.external;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherValidationResponse {
    private boolean exists;
    private boolean isTeacher;
    private String fullName;
    private String teacherCode;
    private String email;
}
