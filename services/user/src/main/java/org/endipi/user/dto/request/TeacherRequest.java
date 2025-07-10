package org.endipi.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherRequest {
    private Long id;

    @NotBlank(message = "Mã giảng viên không được để trống!")
    private String teacherCode;

    private String academicRank;
    private String degree;
    private Long userId;
}
