package org.endipi.enrollment.repository;

import org.endipi.enrollment.dto.response.CourseOfferingResponse;
import org.endipi.enrollment.entity.CourseOffering;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface CourseOfferingRepository extends JpaRepository<CourseOffering, Long> {
    // Search criterion used in CourseOfferingServiceImpl.java
    Page<CourseOffering> findByOpenTimeAfter(LocalDateTime after, Pageable pageable);

    // Search criterion used in CourseOfferingServiceImpl.java
    Page<CourseOffering> findByCloseTimeBefore(LocalDateTime before, Pageable pageable);

    // Supply correct currentStudents for findAll()
    @Query("""
            select new org.endipi.enrollment.entity.CourseOffering(
                        co.id,
                        co.maxStudents,
                        cast(count(cr.id) as int),
                        co.openTime,
                        co.closeTime,
                        co.courseId,
                        co.semester,
                        co.teacherId,
                        co.courseRegistrations
            )
            from CourseOffering co
            join fetch co.courseRegistrations cr
            join fetch co.semester
            """)
    List<CourseOffering> findAllWithCurrentStudents();
}
