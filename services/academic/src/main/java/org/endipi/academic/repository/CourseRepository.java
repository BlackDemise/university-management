package org.endipi.academic.repository;

import org.endipi.academic.entity.Course;
import org.endipi.academic.enums.course.CourseType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Page<Course> findByNameContainingIgnoreCase(String trim, Pageable pageable);

    Page<Course> findByCodeContainingIgnoreCase(String trim, Pageable pageable);

    Page<Course> findByCourseType(CourseType courseType, Pageable pageable);
}
