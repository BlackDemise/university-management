package org.endipi.academic.service;

import org.endipi.academic.dto.request.PrerequisiteCourseRequest;
import org.endipi.academic.dto.response.PrerequisiteCourseResponse;

import java.util.List;

public interface PrerequisiteCourseService {
    List<PrerequisiteCourseResponse> findAll();

    PrerequisiteCourseResponse findById(Long id);

    PrerequisiteCourseResponse saveWithRetry(PrerequisiteCourseRequest prerequisiteCourseRequest);

    void deleteById(Long id);
}
