package org.endipi.enrollment.dto.request;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseRegistrationRequest {
    private Long id;
    private LocalDateTime registrationDate;
    private String courseRegistrationStatus;
    private Long studentId;
    private Long courseOfferingId;
}
