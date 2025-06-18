package org.endipi.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.endipi.user.enums.student.StudentStatus;

import java.time.LocalDate;

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

    private String studentCode;

    private LocalDate birthDate;

    private Integer courseYear;

    @Enumerated(EnumType.STRING)
    private StudentStatus studentStatus;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
}
