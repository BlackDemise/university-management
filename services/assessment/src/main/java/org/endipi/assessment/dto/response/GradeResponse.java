package org.endipi.assessment.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeResponse {
    private Long id;
    private String scoreType;
    private Double scoreValue;
    private Long courseRegistrationId;
}
