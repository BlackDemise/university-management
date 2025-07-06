package org.endipi.enrollment.dto.external;

import lombok.*;

/// Reflect from Course from academic-service
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
