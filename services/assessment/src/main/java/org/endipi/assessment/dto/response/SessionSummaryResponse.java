package org.endipi.assessment.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionSummaryResponse {
    private Long courseOfferingId;
    private Long totalSessions;
}
