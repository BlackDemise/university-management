package org.endipi.user.repository;

import org.endipi.user.entity.Role;
import org.endipi.user.enums.role.RoleTitle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleTitle(RoleTitle roleTitle);
}
