package org.endipi.enrollment.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.enrollment.dto.request.SemesterRequest;
import org.endipi.enrollment.dto.response.SemesterResponse;
import org.endipi.enrollment.entity.Semester;
import org.endipi.enrollment.enums.error.ErrorCode;
import org.endipi.enrollment.exception.ApplicationException;
import org.endipi.enrollment.mapper.SemesterMapper;
import org.endipi.enrollment.repository.SemesterRepository;
import org.endipi.enrollment.service.SemesterService;
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
public class SemesterServiceImpl implements SemesterService {
    private final SemesterRepository semesterRepository;
    private final SemesterMapper semesterMapper;

    @Value("${retry.semester.attempts}")
    private long retryAttempts;

    @Override
    public List<SemesterResponse> findAll() {
        return semesterRepository.findAll()
                .stream()
                .map(semesterMapper::toResponse)
                .toList();
    }

    @Override
    public SemesterResponse findById(Long id) {
        return semesterRepository.findById(id)
                .map(semesterMapper::toResponse)
                .orElseThrow(() -> new ApplicationException(ErrorCode.SEMESTER_NOT_FOUND));
    }

    @Override
    public SemesterResponse saveWithRetry(SemesterRequest request) {
        for (long attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                log.info("Attempt {} to save semester with ID: {}", attempt, request.getId());
                return save(request);
            } catch (ObjectOptimisticLockingFailureException | StaleObjectStateException e) {
                log.warn("Optimistic lock failure on attempt {} for semesterId {}: {}",
                        attempt, request.getId(), e.getMessage());
                if (attempt == retryAttempts) throw e;
            }
        }
        throw new ApplicationException(ErrorCode.GENERIC_ERROR);
    }

    @Override
    public void deleteById(Long id) {
        Semester semester = semesterRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.SEMESTER_NOT_FOUND));

        // Check if semester has associated course offerings
        if (semester.getCourseOfferings() != null && !semester.getCourseOfferings().isEmpty()) {
            throw new ApplicationException(ErrorCode.SEMESTER_HAS_COURSE_OFFERINGS);
        }

        semesterRepository.deleteById(id);
        log.info("Successfully deleted semester with ID: {}", id);
    }

    @Override
    public Page<SemesterResponse> findBySearchingCriterion(int page, int size, String sort, String searchValue, String searchCriterion) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort.split(",")[0]).ascending());

        // If no search term, return all users
        if (searchValue == null || searchValue.trim().isEmpty()) {
            return semesterRepository.findAll(pageable)
                    .map(semesterMapper::toResponse);
        }

        // Apply search based on search type
        return switch (searchCriterion) {
            case "name" -> semesterRepository.findByNameContainingIgnoreCase(searchValue.trim(), pageable)
                    .map(semesterMapper::toResponse);
            default ->
                // Fallback to no search
                    semesterRepository.findAll(pageable)
                            .map(semesterMapper::toResponse);
        };
    }

    private SemesterResponse save(SemesterRequest request) {
        Semester semester;
        boolean isUpdate = request.getId() != null;

        if (isUpdate) {
            semester = semesterRepository.findById(request.getId())
                    .orElseThrow(() -> new ApplicationException(ErrorCode.SEMESTER_NOT_FOUND));
            semesterMapper.updateFromRequest(request, semester);
        } else {
            semester = semesterMapper.toEntity(request);
        }

        // Business rule validations
        validateBusinessRules(semester, isUpdate);

        semester = semesterRepository.save(semester);

        log.info("Successfully {} semester with ID: {} and name: {}",
                isUpdate ? "updated" : "created", semester.getId(), semester.getName());

        return semesterMapper.toResponse(semester);
    }

    private void validateBusinessRules(Semester semester, boolean isUpdate) {
        // 1. Validate date logic: startDate should be before endDate
        if (semester.getStartDate() != null && semester.getEndDate() != null) {
            if (semester.getStartDate().isAfter(semester.getEndDate())) {
                throw new ApplicationException(ErrorCode.INVALID_SEMESTER_DATES);
            }
        }

        // 2. Check for overlapping semesters (optional business rule)
        // TODO: Add custom repository method to check for overlaps

        // 3. Validate semester name uniqueness
        // TODO: Add custom repository method to check name uniqueness

        log.info("Validating business rules for semester: {} ({} - {})",
                semester.getName(), semester.getStartDate(), semester.getEndDate());
    }
}