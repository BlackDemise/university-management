package org.endipi.academic.repository;

import org.endipi.academic.entity.ProgramCurriculum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgramCurriculumRepository extends JpaRepository<ProgramCurriculum, Long> {
    Page<ProgramCurriculum> findByMajorNameContainingIgnoreCase(String majorName, Pageable pageable);
}
