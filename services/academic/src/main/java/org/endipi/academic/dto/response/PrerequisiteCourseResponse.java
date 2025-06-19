package org.endipi.academic.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrerequisiteCourseResponse {
    private Long id;
    private Long courseId;
    private Long prerequisiteCourseId;
}
