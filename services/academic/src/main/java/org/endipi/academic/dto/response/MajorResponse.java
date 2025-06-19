package org.endipi.academic.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MajorResponse {
    private Long id;
    private String name;
    private Integer totalCreditsRequired;
    private DepartmentResponse departmentResponse;
}
