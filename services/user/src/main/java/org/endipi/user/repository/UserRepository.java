package org.endipi.user.repository;

import org.endipi.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    // Search by full name with pagination
    Page<User> findByFullNameContainingIgnoreCase(String fullName, Pageable pageable);

    // Search by email with pagination
    Page<User> findByEmailContainingIgnoreCase(String email, Pageable pageable);
}
