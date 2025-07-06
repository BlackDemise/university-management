package org.endipi.academic.dto.response;

import lombok.*;

/// Serve update form in DepartmentMemberUpdate.jsx
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberSelectionResponse {
    private Long teacherId;
    private String teacherName;
    private String teacherCode;
    private String teacherEmail;
}
