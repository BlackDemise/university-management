package org.endipi.enrollment.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SemesterRequest {
    private Long id;
    private String name;
    private String startDate;
    private String endDate;
}
