package org.endipi.user.entity;

import jakarta.persistence.*;
import lombok.*;

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

    /// CCCD in Vietnam
    private String identityNumber;

    private String permanentAddress;

    private String currentAddress;

    private String email;

    private String password;

    @OneToOne(mappedBy = "user")
    private Teacher teacher;

    @OneToOne(mappedBy = "user")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;
}
