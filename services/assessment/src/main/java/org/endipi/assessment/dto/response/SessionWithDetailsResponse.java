package org.endipi.assessment.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionWithDetailsResponse {
    private Long id;
    private String sessionType;
    private Integer sessionNumber;
    private String startTime;
    private String endTime;
    private Long courseOfferingId;
    private Long classroomId;
    
    // Cross-service data
    private String courseName;
    private String courseCode;
    private String semesterName;
    private String teacherName;
    private String teacherEmail;
    private String classroomName;
    private String classroomType;
}
