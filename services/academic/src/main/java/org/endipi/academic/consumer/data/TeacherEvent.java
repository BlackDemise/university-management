package org.endipi.academic.consumer.data;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherEvent {
    private String eventType;    // "TEACHER_REMOVED", "TEACHER_ROLE_REMOVED"
    private Long userId;
    private Long teacherId;      // If user has teacher entity
    private String email;
    private String fullName;
    private String teacherCode;
    private Long timestamp;
}
