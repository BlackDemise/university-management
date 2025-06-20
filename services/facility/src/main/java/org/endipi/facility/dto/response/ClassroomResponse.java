package org.endipi.facility.dto.response;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassroomResponse {
    private Long id;
    private String roomNumber;
    private String building;
    private Integer capacity;
    private String equipment;
    private String classroomType;
}
