package org.endipi.assessment.dto.external;

import lombok.*;

import java.time.LocalDateTime;

/**
 * External DTO mirroring enrollment-service CourseRegistrationDetailsResponse
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseRegistrationDetailsResponse {
    private Long id;
    private LocalDateTime registrationDate;
    private String courseRegistrationStatus;
    private Long studentId;
    private Long courseOfferingId;
    
    // Course details from academic-service
    private CourseResponse courseResponse;
    
    // Semester details
    private SemesterResponse semesterResponse;
}
