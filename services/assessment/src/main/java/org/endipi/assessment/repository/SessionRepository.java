package org.endipi.assessment.repository;

import org.endipi.assessment.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session, Long> {
}
