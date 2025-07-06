package org.endipi.enrollment.repository;

import org.endipi.enrollment.entity.CourseOffering;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface CourseOfferingRepository extends JpaRepository<CourseOffering, Long> {
    Page<CourseOffering> findByOpenTimeAfter(LocalDateTime after, Pageable pageable);

    Page<CourseOffering> findByCloseTimeBefore(LocalDateTime before, Pageable pageable);
}
