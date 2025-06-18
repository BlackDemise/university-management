package org.endipi.user.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {
    private Long id;
    private String studentCode;
    private String birthDate;
    private Integer courseYear;
    private String studentStatus;
}
