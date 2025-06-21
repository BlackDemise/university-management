package org.endipi.assessment.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleResponse {
    private Long id;
    private String sessionType;
    private Integer sessionNumber;
    private String startTime;
    private String endTime;
    private Long courseOfferingId;
    private Long classroomId;
}
