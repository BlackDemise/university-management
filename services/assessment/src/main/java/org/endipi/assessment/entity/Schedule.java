package org.endipi.assessment.entity;

import jakarta.persistence.*;
import lombok.*;
import org.endipi.assessment.enums.schedule.SessionType;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"course_offering_id", "classroom_id"}))
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private SessionType sessionType;

    private Integer sessionNumber;

    @ManyToOne
    @JoinColumn(name = "class_duration_id")
    private ClassDuration classDuration;

    // This field depends on enrollment-service
    // Logic guard properly on this field
    private Long courseOfferingId;

    // This field depends on facility-service
    // Logic guard properly on this field
    private Long classroomId;

    @OneToMany(mappedBy = "schedule")
    private List<Attendance> attendances;
}
