package org.endipi.academic.dto.external;

import lombok.*;

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