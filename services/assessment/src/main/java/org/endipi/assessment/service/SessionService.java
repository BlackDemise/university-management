package org.endipi.assessment.service;

import org.endipi.assessment.dto.request.SessionRequest;
import org.endipi.assessment.dto.response.SessionResponse;

import java.util.List;

public interface SessionService {
    List<SessionResponse> findAll();

    SessionResponse findById(Long id);

    SessionResponse saveWithRetry(SessionRequest sessionRequest);

    void deleteById(Long id);
}
