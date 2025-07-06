package org.endipi.enrollment.dto.external;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseBasicInfo {
    private String code;
    private String name;
}
