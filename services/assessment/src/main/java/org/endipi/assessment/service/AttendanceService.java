package org.endipi.assessment.service;

import org.endipi.assessment.dto.request.AttendanceRequest;
import org.endipi.assessment.dto.response.AttendanceResponse;

import java.util.List;

public interface AttendanceService {
    List<AttendanceResponse> findAll();

    AttendanceResponse findById(Long id);

    AttendanceResponse saveWithRetry(AttendanceRequest attendanceRequest);

    void deleteById(Long id);
}