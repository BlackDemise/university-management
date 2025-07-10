package org.endipi.user.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String displayedRole;
    private String phone;
    private String avatarUrl;
    private String identityNumber;
    private String permanentAddress;
    private String currentAddress;
    private String birthDate;
    private TeacherResponse teacherResponse;
    private StudentResponse studentResponse;
}
