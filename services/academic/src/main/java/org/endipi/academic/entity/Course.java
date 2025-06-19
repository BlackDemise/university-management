package org.endipi.academic.entity;

import jakarta.persistence.*;
import lombok.*;
import org.endipi.academic.enums.course.CourseType;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;

    private String name;

    private Integer creditsTheory;

    private Integer creditsPractical;

    @Enumerated(EnumType.STRING)
    private CourseType courseType;

    @OneToMany(mappedBy = "course")
    private List<ProgramCurriculum> programCurriculums;

    @OneToMany(mappedBy = "course")
    private List<PrerequisiteCourse> prerequisites;

    @OneToMany(mappedBy = "prerequisiteCourse")
    private List<PrerequisiteCourse> requiredBy;
}
