package org.endipi.user.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String phone;
    private String identityNumber;
    private String permanentAddress;
    private String currentAddress;
}
