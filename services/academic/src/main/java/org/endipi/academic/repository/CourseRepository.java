package org.endipi.academic.repository;

import org.endipi.academic.entity.Course;
import org.endipi.academic.enums.course.CourseType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Page<Course> findByNameContainingIgnoreCase(String trim, Pageable pageable);

    Page<Course> findByCodeContainingIgnoreCase(String trim, Pageable pageable);

    Page<Course> findByCourseType(CourseType courseType, Pageable pageable);
    
    // Get all distinct department names for a specific course
    @Query("SELECT DISTINCT d.name FROM Course c " +
           "JOIN c.programCurriculums pc " +
           "JOIN pc.major m " +
           "JOIN m.department d " +
           "WHERE c.id = :courseId")
    List<String> findDepartmentNamesByCourseId(@Param("courseId") Long courseId);
    
    // Get all courses with their department information (for bulk operations)
    @Query("SELECT c.id as courseId, d.name as departmentName FROM Course c " +
           "JOIN c.programCurriculums pc " +
           "JOIN pc.major m " +
           "JOIN m.department d")
    List<CourseDepartmentProjection> findAllCoursesWithDepartments();
    
    // Projection interface for structured results
    interface CourseDepartmentProjection {
        Long getCourseId();
        String getDepartmentName();
    }
}
