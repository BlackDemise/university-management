package org.endipi.academic.service;

import org.endipi.academic.dto.request.CourseRequest;
import org.endipi.academic.dto.response.CourseResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CourseService {
    List<CourseResponse> findAll();

    CourseResponse findById(Long id);

    CourseResponse saveWithRetry(CourseRequest courseRequest);

    void deleteById(Long id);

    Page<CourseResponse> findBySearchingCriterion(int page, int size, String sort, String searchValue, String searchCriterion);

    // Endpoints for S2S communication
    boolean validateCourse(Long courseId);
}
