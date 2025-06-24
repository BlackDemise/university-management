package org.endipi.assessment.entity;

import jakarta.persistence.*;
import lombok.*;
import org.endipi.assessment.enums.session.SessionType;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"classroom_id", "start_time", "end_time"}))
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private SessionType sessionType;

    private Integer sessionNumber;

    // Start time of a session
    private LocalDateTime startTime;

    // End time of a session
    private LocalDateTime endTime;

    // This field depends on enrollment-service
    // Logic guard properly on this field
    private Long courseOfferingId;

    // This field depends on facility-service
    // Logic guard properly on this field
    private Long classroomId;

    @OneToMany(mappedBy = "session")
    private List<Attendance> attendances;
}
