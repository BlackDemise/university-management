package org.endipi.enrollment.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.enrollment.client.classroomservice.ClassroomServiceClient;
import org.endipi.enrollment.client.courseservice.CourseServiceClient;
import org.endipi.enrollment.client.userservice.UserServiceClient;
import org.endipi.enrollment.dto.external.ClassroomValidationResponse;
import org.endipi.enrollment.dto.external.TeacherValidationResponse;
import org.endipi.enrollment.dto.request.CourseOfferingRequest;
import org.endipi.enrollment.dto.response.CourseOfferingResponse;
import org.endipi.enrollment.entity.CourseOffering;
import org.endipi.enrollment.enums.error.ErrorCode;
import org.endipi.enrollment.exception.ApplicationException;
import org.endipi.enrollment.mapper.CourseOfferingMapper;
import org.endipi.enrollment.repository.CourseOfferingRepository;
import org.endipi.enrollment.repository.SemesterRepository;
import org.endipi.enrollment.service.CourseOfferingService;
import org.hibernate.StaleObjectStateException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CourseOfferingServiceImpl implements CourseOfferingService {
    private final CourseOfferingRepository courseOfferingRepository;
    private final CourseOfferingMapper courseOfferingMapper;
    private final SemesterRepository semesterRepository;
    private final CourseServiceClient courseServiceClient;
    private final UserServiceClient userServiceClient;
    private final ClassroomServiceClient classroomServiceClient;

    @Value("${retry.course-offering.attempts}")
    private long retryAttempts;

    @Override
    public List<CourseOfferingResponse> findAll() {
        return courseOfferingRepository.findAll()
                .stream()
                .map(courseOfferingMapper::toResponse)
                .toList();
    }

    @Override
    public CourseOfferingResponse findById(Long id) {
        return courseOfferingRepository.findById(id)
                .map(courseOfferingMapper::toResponse)
                .orElseThrow(() -> new ApplicationException(ErrorCode.COURSE_OFFERING_NOT_FOUND));
    }

    @Override
    public CourseOfferingResponse saveWithRetry(CourseOfferingRequest request) {
        for (long attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                log.info("Attempt {} to save course offering with ID: {}", attempt, request.getId());
                return save(request);
            } catch (ObjectOptimisticLockingFailureException | StaleObjectStateException e) {
                log.warn("Optimistic lock failure on attempt {} for courseOfferingId {}: {}",
                        attempt, request.getId(), e.getMessage());
                if (attempt == retryAttempts) throw e;
            }
        }
        throw new ApplicationException(ErrorCode.GENERIC_ERROR);
    }

    private CourseOfferingResponse save(CourseOfferingRequest request) {
        // Validate course existence
        boolean isCourseExists = courseServiceClient.validateCourse(request.getCourseId());

        if (!isCourseExists) {
            throw new ApplicationException(ErrorCode.COURSE_NOT_FOUND);
        }

        // Validate semester existence
        if (!semesterRepository.existsById(request.getSemesterId())) {
            throw new ApplicationException(ErrorCode.SEMESTER_NOT_FOUND);
        }

        // Validate teacher existence
        try {
            TeacherValidationResponse validation = userServiceClient.validateTeacher(request.getTeacherId());

            if (!validation.isExists()) {
                throw new ApplicationException(ErrorCode.TEACHER_NOT_FOUND);
            }

            if (!validation.isTeacher()) {
                throw new ApplicationException(ErrorCode.USER_NOT_A_TEACHER);
            }

            log.info("Teacher validation successful: {} ({})", validation.getFullName(), validation.getTeacherCode());

        } catch (Exception e) {
            log.error("Failed to validate teacher with ID: {}", request.getTeacherId(), e);
            throw new ApplicationException(ErrorCode.TEACHER_VALIDATION_FAILED);
        }

        // Validate classroom existence
        try {
            ClassroomValidationResponse validation = classroomServiceClient.validateClassroom(request.getClassroomId());

            if (!validation.isExists()) {
                throw new ApplicationException(ErrorCode.CLASSROOM_NOT_FOUND);
            }

            log.info("Classroom validation successful: {}", validation.getClassroomType());
        } catch (Exception e) {
            log.error("Failed to validate classroom with ID: {}", request.getClassroomId(), e);
            throw new ApplicationException(ErrorCode.CLASSROOM_VALIDATION_FAILED);
        }

        CourseOffering courseOffering;
        boolean isUpdate = request.getId() != null;

        if (isUpdate) {
            courseOffering = courseOfferingRepository.findById(request.getId())
                    .orElseThrow(() -> new ApplicationException(ErrorCode.COURSE_OFFERING_NOT_FOUND));
            courseOfferingMapper.updateFromRequest(request, courseOffering, semesterRepository);
        } else {
            courseOffering = courseOfferingMapper.toEntity(request, semesterRepository);
        }

        if (!isValidDuration(courseOffering)) {
            throw new ApplicationException(ErrorCode.INVALID_DURATION);
        }

        if (!hasAvailableSlots(courseOffering)) {
            throw new ApplicationException(ErrorCode.MAXIMUM_CAPACITY_REACHED);
        }

        if (!isRegistrationOpen(courseOffering)) {
            throw new ApplicationException(ErrorCode.REGISTRATION_CLOSED);
        }

        courseOffering = courseOfferingRepository.save(courseOffering);
        return courseOfferingMapper.toResponse(courseOffering);
    }

    @Override
    public void deleteById(Long id) {
        if (!courseOfferingRepository.existsById(id)) {
            throw new ApplicationException(ErrorCode.COURSE_OFFERING_NOT_FOUND);
        }

        courseOfferingRepository.deleteById(id);
    }

    /// Capacity management check
    private boolean hasAvailableSlots(CourseOffering courseOffering) {
        return courseOffering.getCurrentStudents() < courseOffering.getMaxStudents();
    }

    /// Registration duration check
    private boolean isRegistrationOpen(CourseOffering courseOffering) {
        LocalDateTime now = LocalDateTime.now();
        return now.isAfter(courseOffering.getOpenTime()) && now.isBefore(courseOffering.getCloseTime());
    }

    /// Duration creation logic check
    private boolean isValidDuration(CourseOffering courseOffering) {
        LocalDateTime openTime = courseOffering.getOpenTime();
        LocalDateTime closeTime = courseOffering.getCloseTime();
        return openTime != null && closeTime != null && openTime.isBefore(closeTime);
    }
}
