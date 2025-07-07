package org.endipi.assessment.dto.external;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseBasicInfo {
    private Long id;
    private String code;
    private String name;
}
