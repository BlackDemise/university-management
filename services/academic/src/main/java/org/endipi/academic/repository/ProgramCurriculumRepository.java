package org.endipi.academic.repository;

import org.endipi.academic.entity.ProgramCurriculum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgramCurriculumRepository extends JpaRepository<ProgramCurriculum, Long> {
    // Search method used in ProgramCurriculumList.jsx page
    Page<ProgramCurriculum> findByMajorNameContainingIgnoreCase(String majorName, Pageable pageable);

    List<ProgramCurriculum> findByMajorId(Long majorId);
}
