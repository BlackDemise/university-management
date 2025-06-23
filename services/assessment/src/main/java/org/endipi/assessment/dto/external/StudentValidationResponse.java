package org.endipi.assessment.dto.external;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentValidationResponse {
    private boolean exists;
    private boolean isStudent;
    private String fullName;
    private String studentCode;
    private String email;
}
