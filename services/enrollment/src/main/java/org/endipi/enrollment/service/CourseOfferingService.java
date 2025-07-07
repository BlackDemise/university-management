package org.endipi.enrollment.service;

import org.endipi.enrollment.dto.request.CourseOfferingRequest;
import org.endipi.enrollment.dto.response.CourseOfferingDetailsResponse;
import org.endipi.enrollment.dto.response.CourseOfferingResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface CourseOfferingService {
    List<CourseOfferingResponse> findAll();

    CourseOfferingResponse findById(Long id);

    CourseOfferingResponse saveWithRetry(CourseOfferingRequest courseOfferingRequest);

    void deleteById(Long id);

    boolean validateCourseOffering(Long courseOfferingId);

    Page<CourseOfferingResponse> findBySearchingCriterion(int page, int size, String sort, String searchValue, String searchCriterion);

    // New batch methods for cross-service optimization
    Map<Long, CourseOfferingDetailsResponse> getCourseOfferingDetailsByIds(Set<Long> courseOfferingIds);

    List<CourseOfferingDetailsResponse> getAllCourseOfferingsWithDetails();
}
