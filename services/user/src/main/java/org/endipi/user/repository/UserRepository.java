package org.endipi.user.repository;

import org.endipi.user.entity.User;
import org.endipi.user.enums.role.RoleTitle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByRole_RoleTitleAndId(RoleTitle roleTitle, Long id);

    List<User> findByRole_RoleTitle(RoleTitle roleTitle);

    // Search by full name with pagination
    Page<User> findByFullNameContainingIgnoreCase(String fullName, Pageable pageable);

    // Search by email with pagination
    Page<User> findByEmailContainingIgnoreCase(String email, Pageable pageable);
}
