package org.endipi.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentRequest {
    private Long id;

    @NotBlank(message = "Mã sinh viên không được để trống!")
    private String studentCode;

    private Integer courseYear;
    private String studentStatus;
    private Long userId;
    private Long majorId;
}
