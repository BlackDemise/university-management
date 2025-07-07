package org.endipi.assessment.dto.external;

import lombok.*;

/**
 * External DTO mirroring user-service S2SStudentResponse
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
