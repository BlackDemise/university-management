package org.endipi.user.dto.s2s;

import lombok.*;

/**
 * Represents a response for a teacher in the S2S (Server-to-Server) communication.
 * This class maps to TeacherResponse in academic-service.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class S2STeacherResponse {
    private Long teacherId;
    private String teacherName;
    private String teacherCode;
    private String teacherEmail;
}
