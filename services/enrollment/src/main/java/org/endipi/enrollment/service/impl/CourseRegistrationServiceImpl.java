package org.endipi.enrollment.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.enrollment.client.userservice.UserServiceClient;
import org.endipi.enrollment.dto.external.StudentValidationResponse;
import org.endipi.enrollment.dto.request.CourseRegistrationRequest;
import org.endipi.enrollment.dto.response.CourseRegistrationResponse;
import org.endipi.enrollment.entity.CourseRegistration;
import org.endipi.enrollment.enums.error.ErrorCode;
import org.endipi.enrollment.exception.ApplicationException;
import org.endipi.enrollment.mapper.CourseRegistrationMapper;
import org.endipi.enrollment.repository.CourseOfferingRepository;
import org.endipi.enrollment.repository.CourseRegistrationRepository;
import org.endipi.enrollment.service.CourseRegistrationService;
import org.hibernate.StaleObjectStateException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CourseRegistrationServiceImpl implements CourseRegistrationService {
    private final CourseRegistrationRepository courseRegistrationRepository;
    private final CourseRegistrationMapper courseRegistrationMapper;
    private final CourseOfferingRepository courseOfferingRepository;
    private final UserServiceClient userServiceClient;

    @Value("${retry.course-registration.attempts}")
    private long retryAttempts;

    @Override
    public List<CourseRegistrationResponse> findAll() {
        return courseRegistrationRepository.findAll()
                .stream()
                .map(courseRegistrationMapper::toResponse)
                .toList();
    }

    @Override
    public CourseRegistrationResponse findById(Long id) {
        return courseRegistrationRepository.findById(id)
                .map(courseRegistrationMapper::toResponse)
                .orElseThrow(() -> new ApplicationException(ErrorCode.COURSE_REGISTRATION_NOT_FOUND));
    }

    @Override
    public CourseRegistrationResponse saveWithRetry(CourseRegistrationRequest request) {
        for (long attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                log.info("Attempt {} to save course registration with ID: {}", attempt, request.getId());
                return save(request);
            } catch (ObjectOptimisticLockingFailureException | StaleObjectStateException e) {
                log.warn("Optimistic lock failure on attempt {} for courseRegistrationId {}: {}",
                        attempt, request.getId(), e.getMessage());
                if (attempt == retryAttempts) throw e;
            }
        }
        throw new ApplicationException(ErrorCode.GENERIC_ERROR);
    }

    @Override
    public void deleteById(Long id) {
        if (!courseRegistrationRepository.existsById(id)) {
            throw new ApplicationException(ErrorCode.COURSE_REGISTRATION_NOT_FOUND);
        }

        courseRegistrationRepository.deleteById(id);
        log.info("Successfully deleted course registration with ID: {}", id);
    }

    private CourseRegistrationResponse save(CourseRegistrationRequest request) {
        // Validate course offering existence
        if (!courseOfferingRepository.existsById(request.getCourseOfferingId())) {
            throw new ApplicationException(ErrorCode.COURSE_OFFERING_NOT_FOUND);
        }

        // Validate student existence
        try {
            StudentValidationResponse validation = userServiceClient.validateStudent(request.getStudentId());

            if (!validation.isExists()) {
                throw new ApplicationException(ErrorCode.USER_NOT_FOUND);
            }

            if (!validation.isStudent()) {
                throw new ApplicationException(ErrorCode.USER_NOT_A_STUDENT);
            }

            log.info("Student validation successful: {} ({})", validation.getFullName(), validation.getStudentCode());
        } catch (Exception e) {
            log.error("Failed to validate student with ID: {}", request.getStudentId(), e);
            throw new ApplicationException(ErrorCode.STUDENT_VALIDATION_FAILED);
        }

        CourseRegistration courseRegistration;
        boolean isUpdate = request.getId() != null;

        if (isUpdate) {
            courseRegistration = courseRegistrationRepository.findById(request.getId())
                    .orElseThrow(() -> new ApplicationException(ErrorCode.COURSE_REGISTRATION_NOT_FOUND));
            courseRegistrationMapper.updateFromRequest(request, courseRegistration, courseOfferingRepository);
        } else {
            courseRegistration = courseRegistrationMapper.toEntity(request, courseOfferingRepository);
            // Set registration date for new registrations
            if (courseRegistration.getRegistrationDate() == null) {
                courseRegistration.setRegistrationDate(LocalDateTime.now());
            }
        }

        // Business rule validations
        validateBusinessRules(request, isUpdate);

        courseRegistration = courseRegistrationRepository.save(courseRegistration);

        log.info("Successfully {} course registration with ID: {}",
                isUpdate ? "updated" : "created", courseRegistration.getId());

        return courseRegistrationMapper.toResponse(courseRegistration);
    }

    private void validateBusinessRules(CourseRegistrationRequest request, boolean isUpdate) {
        // TODO: Add S2S validation calls:
        // 1. Validate student exists: validateStudent(request.getStudentId())
        // 2. Validate course offering exists and has capacity: validateCourseOffering(request.getCourseOfferingId())
        // 3. Check if student is already registered for this course offering (if creating new)
        // 4. Validate enrollment period (semester dates)

        log.info("Validating business rules for course registration - StudentId: {}, CourseOfferingId: {}",
                request.getStudentId(), request.getCourseOfferingId());
    }
}