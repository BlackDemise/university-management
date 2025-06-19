package org.endipi.academic.entity;

import jakarta.persistence.*;
import lombok.*;
import org.endipi.academic.enums.department.DepartmentMemberType;

import java.time.LocalDateTime;

/// Establish an n - n relationship between Department and Teacher via this entity.
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"department_id", "teacher_id"}))
public class DepartmentMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    // This field depends on user-service
    // Logic guard properly on this field
    private Long teacherId;

    @Enumerated(EnumType.STRING)
    private DepartmentMemberType departmentMemberType;

    private LocalDateTime startDate;

    private LocalDateTime endDate;
}
