package org.endipi.academic.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseRequest {
    private Long id;
    private String code;
    private String name;
    private Integer creditsTheory;
    private Integer creditsPractical;
    private String courseType;
}