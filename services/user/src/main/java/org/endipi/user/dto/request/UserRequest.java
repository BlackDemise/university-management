package org.endipi.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    private Long id;

    @NotBlank(message = "Họ và tên không được để trống!")
    private String fullName;

    @NotBlank(message = "Email không được để trống!")
    @Email(message = "Email không đúng định dạng!")
    private String email;

    @NotBlank(message = "Vai trò không được để trống!")
    private String role;

    private String phone;
    private String avatarUrl;

    /// CCCD in Vietnam
    private String identityNumber;
    private String permanentAddress;
    private String currentAddress;
    private String birthDate;

    // @Valid -> this will cause confusion if role == "STUDENT" but teacherRequest is included,
    // so we will validate this via service layer instead
    private TeacherRequest teacherRequest;

    // @Valid -> same reason as above
    private StudentRequest studentRequest;
}
