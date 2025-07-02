package org.endipi.academic.repository;

import org.endipi.academic.dto.response.MajorCurriculumResponse;
import org.endipi.academic.entity.Major;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MajorRepository extends JpaRepository<Major, Long> {
    Page<Major> findByNameContainingIgnoreCase(String name, org.springframework.data.domain.Pageable pageable);

    Page<Major> findByDepartmentNameContainingIgnoreCase(String departmentName, Pageable pageable);

    @Query("""
    SELECT new org.endipi.academic.dto.response.MajorCurriculumResponse(
        m.id,
        m.name,
        COUNT(pc.id),
        COALESCE(SUM(c.creditsTheory), 0),
        COALESCE(SUM(c.creditsPractical), 0)
    )
    FROM Major m
    LEFT JOIN m.programCurriculums pc
    LEFT JOIN pc.course c
    GROUP BY m.id, m.name
    ORDER BY m.name
    """)
    Page<MajorCurriculumResponse> findMajorCurriculumSummary(Pageable pageable);
}
