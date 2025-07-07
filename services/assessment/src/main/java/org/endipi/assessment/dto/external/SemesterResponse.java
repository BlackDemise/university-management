package org.endipi.assessment.dto.external;

import lombok.*;

import java.time.LocalDate;

/**
 * External DTO mirroring enrollment-service SemesterResponse
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SemesterResponse {
    private Long id;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
}
