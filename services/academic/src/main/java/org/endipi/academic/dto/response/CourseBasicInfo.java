package org.endipi.academic.dto.response;

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
