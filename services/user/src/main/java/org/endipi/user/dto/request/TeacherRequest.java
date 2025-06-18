package org.endipi.user.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherRequest {
    private Long id;
    private String teacherCode;
    private String academicRank;
    private String degree;
    private Long userId;
}
