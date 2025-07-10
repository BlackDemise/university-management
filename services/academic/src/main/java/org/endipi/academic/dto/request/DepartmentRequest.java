package org.endipi.academic.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentRequest {
    private Long id;

    @NotBlank(message = "Tên khoa/phòng ban không được để trống!")
    @Size(min = 2, max = 255, message = "Tên khoa/phòng ban phải có từ 2 đến 255 ký tự!")
    private String name;
}
