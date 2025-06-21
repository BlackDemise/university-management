package org.endipi.enrollment.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseRegistrationResponse {
    private Long id;
    private LocalDateTime registrationDate;
    private String courseRegistrationStatus;
    private Long studentId;
    private Long courseOfferingId;
}
