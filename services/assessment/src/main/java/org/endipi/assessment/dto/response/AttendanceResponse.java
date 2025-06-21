package org.endipi.assessment.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponse {
    private Long id;
    private String attendanceStatus;
    private Long studentId;
    private Long scheduleId;
}
