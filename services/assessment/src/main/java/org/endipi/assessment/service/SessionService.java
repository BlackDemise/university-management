package org.endipi.assessment.service;

import org.endipi.assessment.dto.request.SessionRequest;
import org.endipi.assessment.dto.response.CourseSessionSummaryResponse;
import org.endipi.assessment.dto.response.SessionResponse;
import org.endipi.assessment.dto.response.SessionWithDetailsResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface SessionService {
    List<SessionResponse> findAll();

    SessionResponse findById(Long id);

    SessionResponse saveWithRetry(SessionRequest sessionRequest);

    void deleteById(Long id);

    // New optimized endpoints for UI
    Page<CourseSessionSummaryResponse> getOptimizedSessionSummary(int page, int size, String sort);

    List<SessionWithDetailsResponse> getSessionsWithDetailsByOffering(Long courseOfferingId);

    Page<SessionWithDetailsResponse> getSessionsWithDetailsByOfferingWithPaging(Long courseOfferingId, int page, int size, String sort);
}
