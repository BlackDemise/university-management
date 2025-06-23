package org.endipi.enrollment.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"course_id", "semester_id", "teacher_id", "classroom_id"}))
public class CourseOffering {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer maxStudents;

    private Integer currentStudents;

    // Use openTime and closeTime to restrict registration
    private LocalDateTime openTime;

    private LocalDateTime closeTime;

    // This field depends on academic-service
    // Logic guard properly on this field
    private Long courseId;

    @ManyToOne
    @JoinColumn(name = "semester_id")
    private Semester semester;

    // This field depends on user-service
    // Logic guard properly on this field
    private Long teacherId;

    // This field depends on facility-service
    // Logic guard properly on this field
    private Long classroomId;

    @OneToMany(mappedBy = "courseOffering")
    private List<CourseRegistration> courseRegistrations;
}