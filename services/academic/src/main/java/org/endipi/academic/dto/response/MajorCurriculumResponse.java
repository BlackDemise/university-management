package org.endipi.academic.dto.response;

import lombok.*;

/// This represents the ProgramCurriculum with meaningful and already aggregated data.
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MajorCurriculumResponse {
    private Long majorId;
    private String majorName;
    private Long totalCourses;
    private Long totalTheoryCredits;
    private Long totalPracticalCredits;
}
