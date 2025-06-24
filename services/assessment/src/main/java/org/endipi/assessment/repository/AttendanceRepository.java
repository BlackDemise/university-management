package org.endipi.assessment.repository;

import org.endipi.assessment.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    boolean existsByStudentIdAndSessionId(Long sessionId, Long studentId);
}
