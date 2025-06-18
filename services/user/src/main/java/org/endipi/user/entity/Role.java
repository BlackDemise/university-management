package org.endipi.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.endipi.user.enums.role.RoleTitle;

import java.util.List;

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
