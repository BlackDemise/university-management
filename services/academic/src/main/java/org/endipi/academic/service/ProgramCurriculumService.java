package org.endipi.academic.service;

import org.endipi.academic.dto.request.ProgramCurriculumRequest;
import org.endipi.academic.dto.response.CourseResponse;
import org.endipi.academic.dto.response.MajorCurriculumResponse;
import org.endipi.academic.dto.response.ProgramCurriculumResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProgramCurriculumService {
    // Core CRUD
    List<ProgramCurriculumResponse> findAll();
    ProgramCurriculumResponse findById(Long id);
    ProgramCurriculumResponse saveWithRetry(ProgramCurriculumRequest programCurriculumRequest);
    void deleteById(Long id);

    // Search method used in ProgramCurriculumList.jsx page
    Page<ProgramCurriculumResponse> findBySearchingCriterion(int page, int size, String sort, String searchValue, String searchCriterion);

    // Method used in ProgramCurriculumDetails.jsx page to find all program curriculums by major ID
    List<CourseResponse> findAllCoursesInMajor(Long majorId);
}
