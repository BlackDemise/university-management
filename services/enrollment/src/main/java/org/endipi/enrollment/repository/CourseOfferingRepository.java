package org.endipi.enrollment.repository;

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
    // Use a LEFT JOIN here and calculate current students in service later (optimize this later)
    @Query("""
        select distinct co from CourseOffering co
        left join fetch co.courseRegistrations
        left join fetch co.semester
        """)
    List<CourseOffering> findAllWithCurrentStudents();
}
