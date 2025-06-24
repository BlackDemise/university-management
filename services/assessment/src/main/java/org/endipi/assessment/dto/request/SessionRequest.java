package org.endipi.assessment.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionRequest {
    private Long id;
    private String sessionType;
    private Integer sessionNumber;
    private String startTime;
    private String endTime;
    private Long courseOfferingId;
    private Long classroomId;
}
