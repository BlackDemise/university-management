package org.endipi.enrollment.service;

import org.endipi.enrollment.dto.request.SemesterRequest;
import org.endipi.enrollment.dto.response.SemesterResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface SemesterService {
    List<SemesterResponse> findAll();

    SemesterResponse findById(Long id);

    SemesterResponse saveWithRetry(SemesterRequest semesterRequest);

    void deleteById(Long id);

    Page<SemesterResponse> findBySearchingCriterion(int page, int size, String sort, String searchValue, String searchCriterion);
}
