package org.endipi.enrollment.dto.response;

import lombok.*;
import org.endipi.enrollment.dto.external.CourseResponse;

import java.time.LocalDateTime;

/**
 * Enhanced course registration response with course details for S2S communication.
 * Used for optimized batch retrieval in grade management.
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
