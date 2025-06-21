package org.endipi.academic.service;

import org.endipi.academic.dto.request.CourseRequest;
import org.endipi.academic.dto.response.CourseResponse;

import java.util.List;

public interface CourseService {
    List<CourseResponse> findAll();

    CourseResponse findById(Long id);

    CourseResponse saveWithRetry(CourseRequest courseRequest);

    void deleteById(Long id);

    // Endpoints for S2S communication
    boolean validateCourse(Long courseId);
}
