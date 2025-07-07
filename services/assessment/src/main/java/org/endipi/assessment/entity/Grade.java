package org.endipi.assessment.entity;

import jakarta.persistence.*;
import lombok.*;
import org.endipi.assessment.enums.grade.GradeType;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"course_registration_id", "score_type"}))
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private GradeType gradeType;

    private Double gradeValue;

    // This field depends on enrollment-service
    // Logic guard properly on this field
    private Long courseRegistrationId;
}
