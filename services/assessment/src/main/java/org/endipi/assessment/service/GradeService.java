package org.endipi.assessment.service;

import org.endipi.assessment.dto.request.GradeRequest;
import org.endipi.assessment.dto.response.GradeResponse;
import org.endipi.assessment.dto.response.StudentGradeDetailsResponse;

import java.util.List;

public interface GradeService {
    List<GradeResponse> findAll();

    GradeResponse findById(Long id);

    GradeResponse saveWithRetry(GradeRequest gradeRequest);

    void deleteById(Long id);

    // S2S methods for grade management UI
    StudentGradeDetailsResponse getStudentGradeDetails(Long studentId);

    List<GradeResponse> getGradesByCourseRegistrationId(Long courseRegistrationId);
}
