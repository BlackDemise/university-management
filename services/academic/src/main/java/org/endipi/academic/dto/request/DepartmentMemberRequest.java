package org.endipi.academic.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentMemberRequest {
    private Long id;
    private Long departmentId;
    private Long teacherId;
    private String departmentMemberType;
    private String startDate;
    private String endDate;
}
