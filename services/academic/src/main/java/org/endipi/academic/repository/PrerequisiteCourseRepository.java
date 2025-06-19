package org.endipi.academic.repository;

import org.endipi.academic.entity.PrerequisiteCourse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrerequisiteCourseRepository extends JpaRepository<PrerequisiteCourse, Long> {
    // Check if a prerequisite relationship already exists
    boolean existsByCourseIdAndPrerequisiteCourseId(Long courseId, Long prerequisiteCourseId);
}
