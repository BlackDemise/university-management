package org.endipi.academic.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.academic.dto.request.PrerequisiteCourseRequest;
import org.endipi.academic.dto.response.PrerequisiteCourseResponse;
import org.endipi.academic.entity.PrerequisiteCourse;
import org.endipi.academic.enums.error.ErrorCode;
import org.endipi.academic.exception.ApplicationException;
import org.endipi.academic.mapper.PrerequisiteCourseMapper;
import org.endipi.academic.repository.CourseRepository;
import org.endipi.academic.repository.PrerequisiteCourseRepository;
import org.endipi.academic.service.PrerequisiteCourseService;
import org.hibernate.StaleObjectStateException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PrerequisiteCourseServiceImpl implements PrerequisiteCourseService {
    private final PrerequisiteCourseRepository prerequisiteCourseRepository;
    private final PrerequisiteCourseMapper prerequisiteCourseMapper;
    private final CourseRepository courseRepository;

    @Value("${retry.prerequisite-course.attempts}")
    private long retryAttempts;

    @Override
    public List<PrerequisiteCourseResponse> findAll() {
        return prerequisiteCourseRepository.findAll()
                .stream()
                .map(prerequisiteCourseMapper::toResponse)
                .toList();
    }

    @Override
    public PrerequisiteCourseResponse findById(Long id) {
        return prerequisiteCourseRepository.findById(id)
                .map(prerequisiteCourseMapper::toResponse)
                .orElseThrow(() -> new ApplicationException(ErrorCode.PREREQUISITE_COURSE_NOT_FOUND));
    }

    @Override
    public PrerequisiteCourseResponse saveWithRetry(PrerequisiteCourseRequest prerequisiteCourseRequest) {
        for (long attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                log.info("Attempt {} to save prerequisiteCourse with ID: {}", attempt, prerequisiteCourseRequest.getId());
                return save(prerequisiteCourseRequest);
            } catch (ObjectOptimisticLockingFailureException | StaleObjectStateException e) {
                log.warn("Optimistic lock failure on attempt {} for prerequisiteCourseId {}: {}", attempt, prerequisiteCourseRequest.getId(), e.getMessage());
                if (attempt == retryAttempts) throw e;
            }
        }

        throw new ApplicationException(ErrorCode.GENERIC_ERROR);
    }

    @Override
    public void deleteById(Long id) {
        if (!prerequisiteCourseRepository.existsById(id)) {
            throw new ApplicationException(ErrorCode.PREREQUISITE_COURSE_NOT_FOUND);
        }

        prerequisiteCourseRepository.deleteById(id);
    }

    private PrerequisiteCourseResponse save(PrerequisiteCourseRequest prerequisiteCourseRequest) {
        // Business Logic Validation
        validateBusinessRules(prerequisiteCourseRequest);

        PrerequisiteCourse prerequisiteCourse;
        boolean isUpdate = prerequisiteCourseRequest.getId() != null;

        if (isUpdate) {
            // UPDATE scenario: Load existing entity and update it
            prerequisiteCourse = prerequisiteCourseRepository.findById(prerequisiteCourseRequest.getId())
                    .orElseThrow(() -> new ApplicationException(ErrorCode.PREREQUISITE_COURSE_NOT_FOUND));

            // Use mapper to update existing entity with new data
            prerequisiteCourseMapper.updateFromRequest(prerequisiteCourseRequest, prerequisiteCourse, courseRepository);
        } else {
            // CREATE scenario: Check for duplicates first
            validateNoDuplicatePrerequisite(prerequisiteCourseRequest);

            // Create new entity from request
            prerequisiteCourse = prerequisiteCourseMapper.toEntity(prerequisiteCourseRequest, courseRepository);
        }

        // Save the entity (works for both create and update)
        prerequisiteCourse = prerequisiteCourseRepository.save(prerequisiteCourse);

        // Convert to response DTO and return
        return prerequisiteCourseMapper.toResponse(prerequisiteCourse);
    }

    // BUSINESS LOGIC VALIDATION
    private void validateBusinessRules(PrerequisiteCourseRequest request) {
        // Rule 1: Course cannot be its own prerequisite
        if (request.getCourseId().equals(request.getPrerequisiteCourseId())) {
            throw new ApplicationException(ErrorCode.COURSE_CANNOT_BE_ITS_OWN_PREREQUISITE);
        }

        // Rule 2: Both courses must exist (this will be checked by mapper, but good to validate early)
        validateCoursesExist(request.getCourseId(), request.getPrerequisiteCourseId());

        // Rule 3: Check for circular dependencies (optional advanced validation)
        validateNoCircularDependency(request);
    }

    private void validateCoursesExist(Long courseId, Long prerequisiteCourseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ApplicationException(ErrorCode.COURSE_NOT_FOUND);
        }
        if (!courseRepository.existsById(prerequisiteCourseId)) {
            throw new ApplicationException(ErrorCode.COURSE_NOT_FOUND);
        }
    }

    private void validateNoDuplicatePrerequisite(PrerequisiteCourseRequest request) {
        // Check if this prerequisite relationship already exists
        boolean exists = prerequisiteCourseRepository.existsByCourseIdAndPrerequisiteCourseId(
                request.getCourseId(), request.getPrerequisiteCourseId());

        if (exists) {
            throw new ApplicationException(ErrorCode.DUPLICATE_PREREQUISITE_RELATIONSHIP);
        }
    }

    // Prevent circular dependencies
    private void validateNoCircularDependency(PrerequisiteCourseRequest request) {
        // Check if prerequisiteCourseId already depends on courseId (would create a cycle)
        // This prevents: Course A -> Course B -> Course A
        if (hasPrerequisiteRelationship(request.getPrerequisiteCourseId(), request.getCourseId())) {
            throw new ApplicationException(ErrorCode.CIRCULAR_PREREQUISITE_DEPENDENCY);
        }
    }

    private boolean hasPrerequisiteRelationship(Long courseId, Long potentialPrerequisiteId) {
        // Check if courseId has potentialPrerequisiteId as a prerequisite (directly or indirectly)
        return prerequisiteCourseRepository.existsByCourseIdAndPrerequisiteCourseId(courseId, potentialPrerequisiteId);
    }
}
