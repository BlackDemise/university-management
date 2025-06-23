package org.endipi.assessment.repository;

import org.endipi.assessment.entity.Grade;
import org.endipi.assessment.enums.score.ScoreType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    boolean existsByCourseRegistrationIdAndScoreType(Long courseRegistrationId, ScoreType scoreType);
}
