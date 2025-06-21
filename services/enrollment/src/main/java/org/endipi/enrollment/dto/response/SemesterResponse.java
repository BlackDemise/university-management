package org.endipi.enrollment.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SemesterResponse {
    private Long id;
    private String name;
    private String startDate;
    private String endDate;
}
