package org.endipi.academic.dto.response;

import lombok.*;

/// Serves DepartmentMemberDetails.jsx
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentMemberDetailResponse {
    private Long id;
    private Long departmentId;
    private String departmentName;
    private Long teacherId;
    private String teacherName;           // From user-service
    private String teacherCode;           // From user-service
    private String departmentMemberType;
    private String startDate;
    private String endDate;
}
