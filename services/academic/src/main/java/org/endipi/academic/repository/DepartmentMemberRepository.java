package org.endipi.academic.repository;

import org.endipi.academic.entity.DepartmentMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartmentMemberRepository extends JpaRepository<DepartmentMember, Long> {
    boolean existsByDepartmentIdAndTeacherId(Long departmentId, Long teacherId);

    List<DepartmentMember> findByTeacherId(Long teacherId);

    void deleteByTeacherId(Long teacherId);

    List<DepartmentMember> findByDepartmentId(Long departmentId);
}
