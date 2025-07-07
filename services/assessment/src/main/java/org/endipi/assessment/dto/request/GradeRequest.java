package org.endipi.assessment.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeRequest {
    private Long id;
    private String gradeType;
    private Double gradeValue;
    private Long courseRegistrationId;
}
