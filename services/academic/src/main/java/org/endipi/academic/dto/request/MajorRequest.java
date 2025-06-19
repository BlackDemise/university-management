package org.endipi.academic.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MajorRequest {
    private Long id;
    private String name;
    private Integer totalCreditsRequired;
    private Long departmentId;
}
