package org.endipi.assessment.repository;

import org.endipi.assessment.entity.Grade;
import org.endipi.assessment.enums.grade.GradeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    boolean existsByCourseRegistrationIdAndGradeType(Long courseRegistrationId, GradeType gradeType);

    List<Grade> findByCourseRegistrationIdIn(List<Long> courseRegistrationIds);

    List<Grade> findByCourseRegistrationId(Long courseRegistrationId);
}
