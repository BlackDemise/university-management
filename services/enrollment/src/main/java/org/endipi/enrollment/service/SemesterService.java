package org.endipi.enrollment.service;

import org.endipi.enrollment.dto.request.SemesterRequest;
import org.endipi.enrollment.dto.response.SemesterResponse;

import java.util.List;

public interface SemesterService {
    List<SemesterResponse> findAll();

    SemesterResponse findById(Long id);

    SemesterResponse saveWithRetry(SemesterRequest semesterRequest);

    void deleteById(Long id);
}
