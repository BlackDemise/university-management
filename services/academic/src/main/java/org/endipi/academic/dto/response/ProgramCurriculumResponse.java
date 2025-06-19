package org.endipi.academic.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgramCurriculumResponse {
    private Long id;
    private Long courseId;
    private Long majorId;
    private Boolean isMandatory;
    private Integer semesterRecommended;
}
