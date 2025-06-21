package org.endipi.assessment.entity;

import jakarta.persistence.*;
import lombok.*;
import org.endipi.assessment.enums.schedule.SessionType;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private SessionType sessionType;

    private Integer sessionNumber;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    // This field depends on enrollment-service
    // Logic guard properly on this field
    private Long courseOfferingId;

    // This field depends on facility-service
    // Logic guard properly on this field
    private Long classroomId;

    @OneToMany(mappedBy = "schedule")
    private List<Attendance> attendances;
}
