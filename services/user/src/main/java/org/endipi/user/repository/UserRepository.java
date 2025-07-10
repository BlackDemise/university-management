package org.endipi.user.repository;

import org.endipi.user.entity.User;
import org.endipi.user.enums.role.RoleTitle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByRole_RoleTitleAndId(RoleTitle roleTitle, Long id);

    List<User> findByRole_RoleTitle(RoleTitle roleTitle);

    List<User> findAllByRole_RoleTitleAndIdIn(RoleTitle roleTitle, Set<Long> ids);

    // Search by full name with pagination
    Page<User> findByFullNameContainingIgnoreCase(String fullName, Pageable pageable);

    // Search by email with pagination
    Page<User> findByEmailContainingIgnoreCase(String email, Pageable pageable);

    // Excel import validation methods
    @Query("SELECT u.email FROM User u WHERE u.email IN :emails")
    List<String> findEmailsByEmailIn(@Param("emails") List<String> emails);

    boolean existsByEmail(String email);
}
