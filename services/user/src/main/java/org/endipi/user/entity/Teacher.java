package org.endipi.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String teacherCode;

    private String academicRank;

    private String degree;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
}
