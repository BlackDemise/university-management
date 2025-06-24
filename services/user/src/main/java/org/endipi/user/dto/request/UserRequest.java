package org.endipi.user.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    private Long id;
    private String fullName;

    @NotBlank(message = "Email không được để trống!")
    private String email;

    private String role;
    private String phone;
    private String identityNumber;
    private String permanentAddress;
    private String currentAddress;

    // @Valid -> this will cause confusion if role == "STUDENT" but teacherRequest is included,
    // so we will validate this via service layer instead
    private TeacherRequest teacherRequest;

    // @Valid -> same reason as above
    private StudentRequest studentRequest;
}
