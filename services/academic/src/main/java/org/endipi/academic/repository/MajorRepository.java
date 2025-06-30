package org.endipi.academic.repository;

import org.endipi.academic.entity.Major;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MajorRepository extends JpaRepository<Major, Long> {
    Page<Major> findByNameContainingIgnoreCase(String name, org.springframework.data.domain.Pageable pageable);

    Page<Major> findByDepartmentNameContainingIgnoreCase(String departmentName, Pageable pageable);
}
