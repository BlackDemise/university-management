package org.endipi.user.dto.s2s;

import lombok.*;

/**
 * Represents a response for a student in the S2S (Server-to-Server) communication.
 * This class is used for optimized batch retrieval of student information.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class S2SStudentResponse {
    private Long studentId;
    private Long userId;
    private String studentName;
    private String studentCode;
    private String studentEmail;
    private String studentStatus;
    private Integer courseYear;
    private Long majorId;
}
