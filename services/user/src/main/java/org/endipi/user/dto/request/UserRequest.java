package org.endipi.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    private Long id;
    private String fullName; //ok

    @NotBlank(message = "Email không được để trống!")
    private String email; //ok

    private String role; //ok
    private String phone; //ok
    private String avatarUrl;

    /// CCCD in Vietnam
    private String identityNumber; //ok
    private String permanentAddress; //ok
    private String currentAddress; //ok
    private String birthDate; //ok

    // @Valid -> this will cause confusion if role == "STUDENT" but teacherRequest is included,
    // so we will validate this via service layer instead
    private TeacherRequest teacherRequest;

    // @Valid -> same reason as above
    private StudentRequest studentRequest;
}
