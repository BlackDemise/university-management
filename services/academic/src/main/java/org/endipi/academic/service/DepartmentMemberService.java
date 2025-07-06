package org.endipi.academic.service;

import org.endipi.academic.dto.request.DepartmentMemberRequest;
import org.endipi.academic.dto.response.DepartmentMemberDetailResponse;
import org.endipi.academic.dto.response.DepartmentMemberResponse;
import org.endipi.academic.dto.response.DepartmentSummaryResponse;
import org.endipi.academic.dto.response.MemberSelectionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DepartmentMemberService {
    List<DepartmentMemberResponse> findAll();

    DepartmentMemberResponse findById(Long id);

    DepartmentMemberResponse saveWithRetry(DepartmentMemberRequest departmentMemberRequest);

    void deleteById(Long id);

    List<DepartmentMemberResponse> findByDepartmentId(Long departmentId);

    List<DepartmentMemberResponse> findByTeacherId(Long teacherId);

    void deleteAllByTeacherId(Long teacherId);

    Page<DepartmentSummaryResponse> findDepartmentSummaryWithPaging(int page, int size, String sort, String searchValue, String searchCriterion);

    // New methods for frontend
    List<DepartmentMemberDetailResponse> getDepartmentDetails(Long departmentId);

    List<MemberSelectionResponse> getAvailableTeachers();

    void deleteAllByDepartmentId(Long departmentId);
}
