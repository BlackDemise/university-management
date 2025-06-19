package org.endipi.academic.service;

import org.endipi.academic.dto.request.ProgramCurriculumRequest;
import org.endipi.academic.dto.response.ProgramCurriculumResponse;

import java.util.List;

public interface ProgramCurriculumService {
    List<ProgramCurriculumResponse> findAll();

    ProgramCurriculumResponse findById(Long id);

    ProgramCurriculumResponse saveWithRetry(ProgramCurriculumRequest programCurriculumRequest);

    void deleteById(Long id);
}
