package org.endipi.facility.service;

import org.endipi.facility.dto.external.ClassroomValidationResponse;
import org.endipi.facility.dto.request.ClassroomRequest;
import org.endipi.facility.dto.response.ClassroomResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ClassroomService {
    List<ClassroomResponse> findAll();

    ClassroomResponse findById(Long id);

    ClassroomResponse saveWithRetry(ClassroomRequest classroomRequest);

    void deleteById(Long id);

    Page<ClassroomResponse> findBySearchingCriterion(int page, int size, String sort, String searchValue, String searchCriterion);

    // Endpoints for S2S communication
    ClassroomValidationResponse validateClassroom(Long classroomId);
}
