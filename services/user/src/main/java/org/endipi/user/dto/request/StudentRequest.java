package org.endipi.user.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentRequest {
    private Long id;
    private String studentCode;
    private String birthDate;
    private Integer courseYear;
    private String studentStatus;
    private Long userId;
    private Long majorId;
}
