package org.endipi.academic.service;

import org.endipi.academic.dto.request.DepartmentMemberRequest;
import org.endipi.academic.dto.response.DepartmentMemberResponse;

import java.util.List;

public interface DepartmentMemberService {
    List<DepartmentMemberResponse> findAll();

    DepartmentMemberResponse findById(Long id);

    DepartmentMemberResponse saveWithRetry(DepartmentMemberRequest departmentMemberRequest);

    void deleteById(Long id);

    List<DepartmentMemberResponse> findByDepartmentId(Long departmentId);

    List<DepartmentMemberResponse> findByTeacherId(Long teacherId);

    void deleteAllByTeacherId(Long teacherId);
}
