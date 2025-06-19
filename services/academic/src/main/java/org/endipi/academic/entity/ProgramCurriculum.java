package org.endipi.academic.entity;

import jakarta.persistence.*;
import lombok.*;

/// Establish an n - n relationship between Course and Major via this entity.
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"course_id", "major_id"}))
public class ProgramCurriculum {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne
    @JoinColumn(name = "major_id")
    private Major major;

    private Boolean isMandatory;

    private Integer semesterRecommended;
}
