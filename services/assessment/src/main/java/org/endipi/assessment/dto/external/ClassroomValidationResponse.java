package org.endipi.assessment.dto.external;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassroomValidationResponse {
    private boolean isExists;
    private String classroomType;
}
