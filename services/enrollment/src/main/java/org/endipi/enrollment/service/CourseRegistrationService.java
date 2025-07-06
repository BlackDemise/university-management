package org.endipi.enrollment.service;

import org.endipi.enrollment.dto.request.CourseRegistrationRequest;
import org.endipi.enrollment.dto.response.CourseRegistrationResponse;
import org.endipi.enrollment.dto.response.CourseRegistrationSummaryResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CourseRegistrationService {
    List<CourseRegistrationResponse> findAll();

    CourseRegistrationResponse findById(Long id);

    CourseRegistrationResponse saveWithRetry(CourseRegistrationRequest courseRegistrationRequest);

    void deleteById(Long id);

    Page<CourseRegistrationSummaryResponse> findCourseRegistrationSummariesWithPaging(int page, int size, String sort, String sortDirection, String searchTerm);

    List<CourseRegistrationResponse> findByCourseOfferingId(Long courseOfferingId);

    Page<CourseRegistrationResponse> findByCourseOfferingIdWithPaging(Long courseOfferingId, int page, int size, String sort);

    // S2S
    boolean validateCourseRegistration(Long courseRegistrationId);
}
