package org.endipi.assessment.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeRequest {
    private Long id;
    private String scoreType;
    private Double scoreValue;
    private Long courseRegistrationId;
}
