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
    private String phone;
    private String identityNumber;
    private String permanentAddress;
    private String currentAddress;
    private TeacherResponse teacherResponse;
    private StudentResponse studentResponse;
}
