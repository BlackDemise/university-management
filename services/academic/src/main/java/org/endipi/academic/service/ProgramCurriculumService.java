package org.endipi.academic.service;

import org.endipi.academic.dto.request.ProgramCurriculumRequest;
import org.endipi.academic.dto.response.ProgramCurriculumResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProgramCurriculumService {
    List<ProgramCurriculumResponse> findAll();

    ProgramCurriculumResponse findById(Long id);

    ProgramCurriculumResponse saveWithRetry(ProgramCurriculumRequest programCurriculumRequest);

    Page<ProgramCurriculumResponse> findBySearchingCriterion(int page, int size, String sort, String searchValue, String searchCriterion);

    void deleteById(Long id);
}
