package org.endipi.enrollment.dto.request;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseOfferingRequest {
    private Long id;
    private Integer maxStudents;
    private Integer currentStudents;
    private LocalDateTime openTime;
    private LocalDateTime closeTime;
    private Long courseId;
    private Long semesterId;
    private Long teacherId;
}
