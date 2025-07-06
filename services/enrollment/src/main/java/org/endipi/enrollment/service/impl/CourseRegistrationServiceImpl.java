package org.endipi.enrollment.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.enrollment.client.courseservice.CourseServiceClient;
import org.endipi.enrollment.client.userservice.UserServiceClient;
import org.endipi.enrollment.dto.external.CourseBasicInfo;
import org.endipi.enrollment.dto.external.StudentValidationResponse;
import org.endipi.enrollment.dto.request.CourseRegistrationRequest;
import org.endipi.enrollment.dto.response.CourseRegistrationResponse;
import org.endipi.enrollment.dto.response.CourseRegistrationSummaryResponse;
import org.endipi.enrollment.entity.CourseOffering;
import org.endipi.enrollment.entity.CourseRegistration;
import org.endipi.enrollment.enums.error.ErrorCode;
import org.endipi.enrollment.exception.ApplicationException;
import org.endipi.enrollment.mapper.CourseRegistrationMapper;
import org.endipi.enrollment.repository.CourseOfferingRepository;
import org.endipi.enrollment.repository.CourseRegistrationRepository;
import org.endipi.enrollment.service.CourseRegistrationService;
import org.hibernate.StaleObjectStateException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CourseRegistrationServiceImpl implements CourseRegistrationService {
    private final CourseRegistrationRepository courseRegistrationRepository;
    private final CourseRegistrationMapper courseRegistrationMapper;
    private final CourseOfferingRepository courseOfferingRepository;
    private final UserServiceClient userServiceClient;
    private final CourseServiceClient courseServiceClient;

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
        CourseRegistration courseRegistration = courseRegistrationRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.COURSE_REGISTRATION_NOT_FOUND));

        // Remove the corresponding CourseRegistration in CourseOffering
        CourseOffering courseOffering = courseRegistration.getCourseOffering();
        if (courseOffering != null) {
            courseOffering.setCurrentStudents(courseOffering.getCurrentStudents() - 1);
            courseOfferingRepository.save(courseOffering);
            log.info("Decremented currentStudents to {} for CourseOffering {}",
                    courseOffering.getCurrentStudents(), courseOffering.getId());
        } else {
            log.warn("CourseOffering not found for CourseRegistration ID: {}", id);
        }

        courseRegistrationRepository.deleteById(id);
        log.info("Successfully deleted course registration with ID: {}", id);
    }

    @Override
    public Page<CourseRegistrationSummaryResponse> findCourseRegistrationSummariesWithPaging(
            int page, int size, String sort, String sortDirection, String searchTerm) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sort.split(",")[0]).ascending());

        Page<CourseRegistrationSummaryResponse> pageResult = courseRegistrationRepository
                .findCourseRegistrationSummariesWithPaging(pageable);

        // Step 1: Extract unique courseIds and teacherIds
        Set<Long> courseIds = pageResult.stream()
                .map(CourseRegistrationSummaryResponse::getCourseId)
                .collect(Collectors.toSet());

        Set<Long> teacherIds = pageResult.stream()
                .map(CourseRegistrationSummaryResponse::getTeacherId)
                .collect(Collectors.toSet());

        // Step 2: Call other services in batch
        Map<Long, CourseBasicInfo> courseBasicInfoById = courseServiceClient.getCourseBasicInfoByIds(courseIds);
        Map<Long, String> teacherNamesById = userServiceClient.getTeacherNamesByIds(teacherIds);

        // Step 3: Map and enrich each element
        return pageResult.map(summary -> {
            CourseBasicInfo courseInfo = courseBasicInfoById.get(summary.getCourseId());
            if (courseInfo != null) {
                summary.setCourseCode(courseInfo.getCode());
                summary.setCourseName(courseInfo.getName());
            }
            summary.setTeacherName(teacherNamesById.get(summary.getTeacherId()));

            // Calculate registration status
            summary.setRegistrationStatus(calculateRegistrationStatus(
                summary.getCurrentStudents(),
                summary.getMaxStudents()
            ));

            return summary;
        });
    }


    @Override
    public List<CourseRegistrationResponse> findByCourseOfferingId(Long courseOfferingId) {
        return courseRegistrationRepository.findByCourseOfferingId(courseOfferingId)
                .stream()
                .map(courseRegistrationMapper::toResponse)
                .toList();
    }

    @Override
    public Page<CourseRegistrationResponse> findByCourseOfferingIdWithPaging(Long courseOfferingId, int page, int size, String sort) {
        String[] sortParts = sort.split(",");
        String sortField = sortParts[0];
        String sortDirection = sortParts.length > 1 ? sortParts[1] : "asc";

        Sort.Direction direction = sortDirection.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));

        Page<CourseRegistration> courseRegistrations = courseRegistrationRepository.findByCourseOfferingId(courseOfferingId, pageable);

        return courseRegistrations.map(courseRegistrationMapper::toResponse);
    }

    @Override
    public boolean validateCourseRegistration(Long courseRegistrationId) {
        return courseRegistrationRepository.existsById(courseRegistrationId);
    }

    private String calculateRegistrationStatus(Integer currentStudents, Integer maxStudents) {
        if (currentStudents == null || maxStudents == null) {
            return "UNKNOWN";
        }

        if (currentStudents >= maxStudents) {
            return "FULL";
        }

        // For now, we'll consider all non-full courses as "OPEN"
        // In the future, this could check against openTime/closeTime
        return "OPEN";
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

            // Prevent courseOffering change and offer soft validation (management side and students)
            if (!courseRegistration.getCourseOffering().getId().equals(request.getCourseOfferingId())) {
                throw new ApplicationException(ErrorCode.COURSE_OFFERING_TRANSFER_NOT_ALLOWED);
            }

            courseRegistrationMapper.updateFromRequest(request, courseRegistration, courseOfferingRepository);
        } else {
            courseRegistration = courseRegistrationMapper.toEntity(request, courseOfferingRepository);

            // Set registration date for new registrations
            if (courseRegistration.getRegistrationDate() == null) {
                courseRegistration.setRegistrationDate(LocalDateTime.now());
            }

            // Update the currentStudents in CourseOffering (a little bit cross-service logic)
            CourseOffering courseOffering = courseRegistration.getCourseOffering();
            courseOffering.setCurrentStudents(courseOffering.getCurrentStudents() + 1);
            courseOfferingRepository.save(courseOffering);

            log.info("Incremented currentStudents to {} for CourseOffering {}",
                    courseOffering.getCurrentStudents(), courseOffering.getId());
        }

        validateCourseOfferingExists(courseRegistration.getCourseOffering().getId());
        validateRegistrationCapacity(courseRegistration.getCourseOffering());

        // Business rule validations
        validateBusinessRules(request, isUpdate);

        courseRegistration = courseRegistrationRepository.save(courseRegistration);

        log.info("Successfully {} course registration with ID: {}",
                isUpdate ? "updated" : "created", courseRegistration.getId());

        return courseRegistrationMapper.toResponse(courseRegistration);
    }

    /// Validate existence of CourseOffering
    private void validateCourseOfferingExists(Long courseOfferingId) {
        if (!courseOfferingRepository.existsById(courseOfferingId)) {
            throw new ApplicationException(ErrorCode.COURSE_OFFERING_NOT_FOUND);
        }
        log.info("Course offering with ID {} exists.", courseOfferingId);
    }

    /// Validate capacity of a CourseOffering
    private void validateRegistrationCapacity(CourseOffering courseOffering) {
        if (courseOffering.getCurrentStudents() >= courseOffering.getMaxStudents()) {
            throw new ApplicationException(ErrorCode.MAXIMUM_CAPACITY_REACHED);
        }
        log.info("Course offering with ID {} has capacity for more registrations.", courseOffering.getId());
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