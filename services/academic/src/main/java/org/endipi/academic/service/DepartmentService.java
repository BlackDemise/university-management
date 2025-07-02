package org.endipi.academic.service;

import org.endipi.academic.dto.request.DepartmentRequest;
import org.endipi.academic.dto.response.DepartmentResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface DepartmentService {
    List<DepartmentResponse> findAll();

    DepartmentResponse findById(Long id);

    DepartmentResponse saveWithRetry(DepartmentRequest departmentRequest);

    void deleteById(Long id);

    Page<DepartmentResponse> findBySearchingCriterion(int page, int size, String sort, String searchValue, String searchCriterion);
}
