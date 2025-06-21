package org.endipi.enrollment.dto.external;

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
