package org.endipi.academic.repository;

import org.endipi.academic.dto.response.DepartmentSummaryResponse;
import org.endipi.academic.entity.DepartmentMember;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DepartmentMemberRepository extends JpaRepository<DepartmentMember, Long> {
    boolean existsByDepartmentIdAndTeacherId(Long departmentId, Long teacherId);

    List<DepartmentMember> findByTeacherId(Long teacherId);

    void deleteByTeacherId(Long teacherId);

    List<DepartmentMember> findByDepartmentId(Long departmentId);

    // Query to get ALL departments with their member counts (including 0 members)
    @Query("""
            SELECT new org.endipi.academic.dto.response.DepartmentSummaryResponse(
                dm.department.id,
                dm.department.name,
                COALESCE(COUNT(dm.department.id), 0)
            )
            FROM DepartmentMember dm
            WHERE LOWER(dm.department.name) LIKE LOWER(CONCAT('%', :departmentName, '%'))
            GROUP BY dm.department.id, dm.department.name
            """)
    Page<DepartmentSummaryResponse> findDepartmentSummaryByNameWithPaging(@Param("departmentName") String departmentName, Pageable pageable);

    // Query to get ALL departments with their member counts (including 0 members)
    @Query("""
            SELECT new org.endipi.academic.dto.response.DepartmentSummaryResponse(
                dm.department.id,
                dm.department.name,
                COALESCE(COUNT(dm.department.id), 0)
            )
            FROM DepartmentMember dm
            GROUP BY dm.department.id, dm.department.name
            """)
    Page<DepartmentSummaryResponse> findDepartmentSummaryWithPaging(Pageable pageable);
}
