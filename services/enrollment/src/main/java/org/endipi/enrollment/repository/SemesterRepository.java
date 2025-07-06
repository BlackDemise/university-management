package org.endipi.enrollment.repository;

import org.endipi.enrollment.entity.Semester;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SemesterRepository extends JpaRepository<Semester, Long> {
    Page<Semester> findByNameContainingIgnoreCase(String trim, Pageable pageable);
}
