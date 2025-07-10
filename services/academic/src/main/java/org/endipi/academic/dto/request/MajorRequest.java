package org.endipi.academic.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MajorRequest {
    private Long id;

    @NotBlank(message = "Tên ngành học không được để trống!")
    @Size(min = 2, max = 255, message = "Tên ngành học phải có từ 2 đến 255 ký tự!")
    private String name;

    @Min(value = 1, message = "Số tín chỉ phải lớn hơn 0!")
    @Max(value = 300, message = "Số tín chỉ không được vượt quá 300!")
    private Integer totalCreditsRequired;

    @NotNull(message = "Khoa không được để trống!")
    private Long departmentId;
}
