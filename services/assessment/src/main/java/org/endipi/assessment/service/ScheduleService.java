package org.endipi.assessment.service;

import org.endipi.assessment.dto.request.ScheduleRequest;
import org.endipi.assessment.dto.response.ScheduleResponse;

import java.util.List;

public interface ScheduleService {
    List<ScheduleResponse> findAll();

    ScheduleResponse findById(Long id);

    ScheduleResponse saveWithRetry(ScheduleRequest scheduleRequest);

    void deleteById(Long id);
}
