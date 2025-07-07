package org.endipi.enrollment.repository;

import org.endipi.enrollment.dto.response.CourseRegistrationSummaryResponse;
import org.endipi.enrollment.entity.CourseRegistration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, Long> {
    @Query("""
           select new org.endipi.enrollment.dto.response.CourseRegistrationSummaryResponse(
                      cr.courseOffering.id,
                      cr.courseOffering.courseId,
                      null,
                      null,
                      cr.courseOffering.semester.name,
                      cr.courseOffering.teacherId,
                      null,
                      cr.courseOffering.maxStudents,
                      cr.courseOffering.currentStudents,
                      null
                      )
           from CourseRegistration cr
           group by cr.courseOffering.id, cr.courseOffering.courseId, cr.courseOffering.maxStudents, cr.courseOffering.currentStudents, cr.courseOffering.semester.name, cr.courseOffering.teacherId
           """)
    Page<CourseRegistrationSummaryResponse> findCourseRegistrationSummariesWithPaging(Pageable pageable);

    List<CourseRegistration> findByCourseOfferingId(Long courseOfferingId);

    Page<CourseRegistration> findByCourseOfferingId(Long courseOfferingId, Pageable pageable);

    List<CourseRegistration> findByStudentId(Long studentId);
}
