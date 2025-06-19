package org.endipi.academic.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrerequisiteCourseRequest {
    private Long id;
    private Long courseId;
    private Long prerequisiteCourseId;
}
