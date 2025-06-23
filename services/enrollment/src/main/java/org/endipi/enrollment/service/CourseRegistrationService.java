package org.endipi.enrollment.service;

import org.endipi.enrollment.dto.request.CourseRegistrationRequest;
import org.endipi.enrollment.dto.response.CourseRegistrationResponse;

import java.util.List;

public interface CourseRegistrationService {
    List<CourseRegistrationResponse> findAll();

    CourseRegistrationResponse findById(Long id);

    CourseRegistrationResponse saveWithRetry(CourseRegistrationRequest courseRegistrationRequest);

    void deleteById(Long id);

    // S2S
    boolean validateCourseRegistration(Long courseRegistrationId);
}
