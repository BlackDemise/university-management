package org.endipi.facility.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassroomRequest {
    private Long id;
    private String roomNumber;
    private String building;
    private Integer capacity;
    private String equipment;
    private String classroomType;
}
