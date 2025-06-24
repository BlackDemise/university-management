package org.endipi.assessment.entity;

import jakarta.persistence.*;
import lombok.*;
import org.endipi.assessment.enums.attendance.AttendanceStatus;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "session_id"}))
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private AttendanceStatus attendanceStatus;

    // This field depends on user-service
    // Logic guard properly on this field
    private Long studentId;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private Session session;
}
