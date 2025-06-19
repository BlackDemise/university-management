package org.endipi.academic.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentMemberResponse {
    private Long id;
    private Long departmentId;
    private Long teacherId;
    private String departmentMemberType;
    private String startDate;
    private String endDate;
}
