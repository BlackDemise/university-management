package org.endipi.academic.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgramCurriculumRequest {
    private Long id;
    private Long courseId;
    private Long majorId;
    private Boolean isMandatory;
    private Integer semesterRecommended;
}
