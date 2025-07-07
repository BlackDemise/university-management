package org.endipi.assessment.repository;

import org.endipi.assessment.dto.response.SessionSummaryResponse;
import org.endipi.assessment.entity.Session;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SessionRepository extends JpaRepository<Session, Long> {

    // Get session summary grouped by course offering
    @Query("""
        SELECT new org.endipi.assessment.dto.response.SessionSummaryResponse(
            s.courseOfferingId,
            COUNT(s.id)
        )
        FROM Session s
        GROUP BY s.courseOfferingId
        """)
    Page<SessionSummaryResponse> findSessionSummariesWithPaging(Pageable pageable);

    // Get all sessions for a specific course offering
    List<Session> findByCourseOfferingIdOrderBySessionNumberAsc(Long courseOfferingId);

    // Get sessions by course offering with pagination
    Page<Session> findByCourseOfferingId(Long courseOfferingId, Pageable pageable);
}
