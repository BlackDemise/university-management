package org.endipi.assessment.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRequest {
    private Long id;
    private String attendanceStatus;
    private Long studentId;
    private Long sessionId;
}
