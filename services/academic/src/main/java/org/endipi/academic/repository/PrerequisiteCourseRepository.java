package org.endipi.academic.repository;

import org.endipi.academic.entity.PrerequisiteCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PrerequisiteCourseRepository extends JpaRepository<PrerequisiteCourse, Long> {
    // Check if a prerequisite relationship already exists
    boolean existsByCourseIdAndPrerequisiteCourseId(Long courseId, Long prerequisiteCourseId);
    
    // Find all prerequisite courses for a given course
    List<PrerequisiteCourse> findByCourseId(Long courseId);
    
    // Find all courses that have the given course as a prerequisite
    List<PrerequisiteCourse> findByPrerequisiteCourseId(Long prerequisiteCourseId);
    
    // Count prerequisites for a course
    @Query("SELECT COUNT(pc) FROM PrerequisiteCourse pc WHERE pc.course.id = :courseId")
    Long countPrerequisitesByCourseId(@Param("courseId") Long courseId);
    
    // Check if a course is used as prerequisite for any other course
    @Query("SELECT COUNT(pc) > 0 FROM PrerequisiteCourse pc WHERE pc.prerequisiteCourse.id = :courseId")
    boolean isPrerequisiteForOtherCourses(@Param("courseId") Long courseId);
    
    // Find all prerequisite relationships with course details for summary
    @Query("SELECT pc FROM PrerequisiteCourse pc " +
           "JOIN FETCH pc.course c " +
           "JOIN FETCH pc.prerequisiteCourse prc")
    List<PrerequisiteCourse> findAllWithCourseDetails();
}
