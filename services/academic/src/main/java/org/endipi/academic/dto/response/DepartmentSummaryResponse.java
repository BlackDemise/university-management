package org.endipi.academic.dto.response;

import lombok.*;

/// Serves DepartmentMemberList.jsx
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentSummaryResponse {
    private Long departmentId;
    private String departmentName;
    private Long totalMembers;
}
