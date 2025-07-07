package org.endipi.assessment.dto.external;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassroomDetailsResponse {
    private Long id;
    private String name;
    private String classroomType;
    private Integer capacity;
}
