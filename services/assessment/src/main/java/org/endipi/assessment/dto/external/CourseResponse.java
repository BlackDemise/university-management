package org.endipi.assessment.dto.external;

import lombok.*;

/**
 * External DTO mirroring academic-service CourseResponse
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponse {
    private Long id;
    private String code;
    private String name;
    private Integer creditsTheory;
    private Integer creditsPractical;
    private String courseType;
    private String courseTypeEnum;
}
