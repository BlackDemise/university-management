package org.endipi.academic.service;

import org.endipi.academic.dto.request.DepartmentRequest;
import org.endipi.academic.dto.response.DepartmentResponse;

import java.util.List;

public interface DepartmentService {
    List<DepartmentResponse> findAll();

    DepartmentResponse findById(Long id);

    DepartmentResponse saveWithRetry(DepartmentRequest departmentRequest);

    void deleteById(Long id);
}
