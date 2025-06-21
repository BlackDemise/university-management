package org.endipi.enrollment.repository;

import org.endipi.enrollment.entity.Semester;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SemesterRepository extends JpaRepository<Semester, Long> {
}
