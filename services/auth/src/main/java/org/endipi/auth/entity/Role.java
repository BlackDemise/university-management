package org.endipi.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import org.um.enums.role.RoleTitle;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private RoleTitle roleTitle;

    @OneToMany(mappedBy = "role")
    private List<User> users;
}
