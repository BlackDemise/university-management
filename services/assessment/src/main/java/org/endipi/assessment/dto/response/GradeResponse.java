package org.endipi.assessment.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeResponse {
    private Long id;
    private String gradeType;
    private Double gradeValue;
    private Long courseRegistrationId;
}
