package org.endipi.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.endipi.user.enums.student.StudentStatus;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String studentCode;

    private Integer courseYear;

    // This field depends on academic-service
    // Logic guard properly on this field
    private Long majorId;

    @Enumerated(EnumType.STRING)
    private StudentStatus studentStatus;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
}
