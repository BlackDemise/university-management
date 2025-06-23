package org.endipi.enrollment.entity;

import jakarta.persistence.*;
import lombok.*;
import org.endipi.enrollment.enums.course.CourseRegistrationStatus;

import java.time.LocalDateTime;

/// Represent a specific instance of CourseOffering (which student registers which course).
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_offering_id"}))
public class CourseRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime registrationDate;

    @Enumerated(EnumType.STRING)
    private CourseRegistrationStatus courseRegistrationStatus;

    // This field depends on user-service
    // Logic guard properly on this field
    private Long studentId;

    @ManyToOne
    @JoinColumn(name = "course_offering_id")
    private CourseOffering courseOffering;
}