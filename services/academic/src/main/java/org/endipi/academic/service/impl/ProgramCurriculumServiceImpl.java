package org.endipi.academic.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.academic.dto.request.ProgramCurriculumRequest;
import org.endipi.academic.dto.response.ProgramCurriculumResponse;
import org.endipi.academic.entity.ProgramCurriculum;
import org.endipi.academic.enums.error.ErrorCode;
import org.endipi.academic.exception.ApplicationException;
import org.endipi.academic.mapper.ProgramCurriculumMapper;
import org.endipi.academic.repository.CourseRepository;
import org.endipi.academic.repository.MajorRepository;
import org.endipi.academic.repository.ProgramCurriculumRepository;
import org.endipi.academic.service.ProgramCurriculumService;
import org.hibernate.StaleObjectStateException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProgramCurriculumServiceImpl implements ProgramCurriculumService {
    private final ProgramCurriculumRepository programCurriculumRepository;
    private final ProgramCurriculumMapper programCurriculumMapper;
    private final MajorRepository majorRepository;
    private final CourseRepository courseRepository;

    @Value("${retry.program-curriculum.attempts}")
    private long retryAttempts;

    @Override
    public List<ProgramCurriculumResponse> findAll() {
        return programCurriculumRepository.findAll()
                .stream()
                .map(programCurriculumMapper::toResponse)
                .toList();
    }

    @Override
    public Page<ProgramCurriculumResponse> findBySearchingCriterion(int page, int size, String sort, String searchValue, String searchCriterion) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort.split(",")[0]).ascending());

        // If no search term, return all users
        if (searchValue == null || searchValue.trim().isEmpty()) {
            return programCurriculumRepository.findAll(pageable)
                    .map(programCurriculumMapper::toResponse);
        }

        // Apply search based on search type
        return switch (searchCriterion) {
            case "majorName" -> programCurriculumRepository.findByMajorNameContainingIgnoreCase(searchValue.trim(), pageable)
                    .map(programCurriculumMapper::toResponse);
            default ->
                // Fallback to no search
                    programCurriculumRepository.findAll(pageable)
                            .map(programCurriculumMapper::toResponse);
        };
    }

    @Override
    public ProgramCurriculumResponse findById(Long id) {
        return programCurriculumRepository.findById(id)
                .map(programCurriculumMapper::toResponse)
                .orElseThrow(() -> new ApplicationException(ErrorCode.PROGRAM_CURRICULUM_NOT_FOUND));
    }

    @Override
    public ProgramCurriculumResponse saveWithRetry(ProgramCurriculumRequest programCurriculumRequest) {
        for (long attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                log.info("Attempt {} to save programCurriculum with ID: {}", attempt, programCurriculumRequest.getId());
                return save(programCurriculumRequest);
            } catch (ObjectOptimisticLockingFailureException | StaleObjectStateException e) {
                log.warn("Optimistic lock failure on attempt {} for programCurriculumId {}: {}", attempt, programCurriculumRequest.getId(), e.getMessage());
                if (attempt == retryAttempts) throw e;
            }
        }

        throw new ApplicationException(ErrorCode.GENERIC_ERROR);
    }

    @Override
    public void deleteById(Long id) {
        if (!programCurriculumRepository.existsById(id)) {
            throw new ApplicationException(ErrorCode.PROGRAM_CURRICULUM_NOT_FOUND);
        }

        programCurriculumRepository.deleteById(id);
    }

    private ProgramCurriculumResponse save(ProgramCurriculumRequest programCurriculumRequest) {
        ProgramCurriculum programCurriculum;
        boolean isUpdate = programCurriculumRequest.getId() != null;

        if (isUpdate) {
            // UPDATE scenario: Load existing entity and update it
            programCurriculum = programCurriculumRepository.findById(programCurriculumRequest.getId())
                    .orElseThrow(() -> new ApplicationException(ErrorCode.PROGRAM_CURRICULUM_NOT_FOUND));

            // Use mapper to update existing entity with new data
            programCurriculumMapper.updateFromRequest(programCurriculumRequest, programCurriculum, majorRepository, courseRepository);
        } else {
            // CREATE scenario: Create new entity from request
            programCurriculum = programCurriculumMapper.toEntity(programCurriculumRequest, majorRepository, courseRepository);
        }

        // Business logic check
        validateBusinessRules(programCurriculum);

        // Save the entity (works for both create and update)
        programCurriculum = programCurriculumRepository.save(programCurriculum);

        // Convert to response DTO and return
        return programCurriculumMapper.toResponse(programCurriculum);
    }

    private void validateBusinessRules(ProgramCurriculum curriculum) {
        if (curriculum.getSemesterRecommended() != null && curriculum.getSemesterRecommended() < 0) {
            throw new ApplicationException(ErrorCode.INVALID_SEMESTER_RECOMMENDED);
        }
    }
}
