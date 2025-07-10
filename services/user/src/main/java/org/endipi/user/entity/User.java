package org.endipi.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    private String phone;

    @Column(length = 1000)
    private String avatarUrl;

    /// CCCD in Vietnam
    private String identityNumber;

    private String permanentAddress;

    private String currentAddress;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private LocalDate birthDate;

    @OneToOne(mappedBy = "user")
    private Teacher teacher;

    @OneToOne(mappedBy = "user")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;
}
