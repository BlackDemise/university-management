package org.endipi.assessment.service;

import org.endipi.assessment.dto.request.GradeRequest;
import org.endipi.assessment.dto.response.GradeResponse;

import java.util.List;

public interface GradeService {
    List<GradeResponse> findAll();

    GradeResponse findById(Long id);

    GradeResponse saveWithRetry(GradeRequest gradeRequest);

    void deleteById(Long id);
}
