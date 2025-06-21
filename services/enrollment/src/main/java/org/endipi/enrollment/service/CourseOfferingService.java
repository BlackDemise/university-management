package org.endipi.enrollment.service;

import org.endipi.enrollment.dto.request.CourseOfferingRequest;
import org.endipi.enrollment.dto.response.CourseOfferingResponse;

import java.util.List;

public interface CourseOfferingService {
    List<CourseOfferingResponse> findAll();

    CourseOfferingResponse findById(Long id);

    CourseOfferingResponse saveWithRetry(CourseOfferingRequest courseOfferingRequest);

    void deleteById(Long id);
}
