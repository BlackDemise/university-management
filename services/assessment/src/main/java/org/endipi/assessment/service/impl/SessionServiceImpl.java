package org.endipi.assessment.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.assessment.client.enrollmentservice.EnrollmentServiceClient;
import org.endipi.assessment.client.facilityservice.FacilityServiceClient;
import org.endipi.assessment.dto.external.ClassroomValidationResponse;
import org.endipi.assessment.dto.request.SessionRequest;
import org.endipi.assessment.dto.response.SessionResponse;
import org.endipi.assessment.entity.Session;
import org.endipi.assessment.enums.error.ErrorCode;
import org.endipi.assessment.exception.ApplicationException;
import org.endipi.assessment.mapper.SessionMapper;
import org.endipi.assessment.repository.SessionRepository;
import org.endipi.assessment.service.SessionService;
import org.hibernate.StaleObjectStateException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SessionServiceImpl implements SessionService {
    private final SessionRepository sessionRepository;
    private final SessionMapper sessionMapper;
    private final EnrollmentServiceClient enrollmentServiceClient;
    private final FacilityServiceClient facilityServiceClient;

    @Value("${retry.session.attempts}")
    private long retryAttempts;

    @Override
    public List<SessionResponse> findAll() {
        return sessionRepository.findAll()
                .stream()
                .map(sessionMapper::toResponse)
                .toList();
    }

    @Override
    public SessionResponse findById(Long id) {
        return sessionRepository.findById(id)
                .map(sessionMapper::toResponse)
                .orElseThrow(() -> new ApplicationException(ErrorCode.SCHEDULE_NOT_FOUND));
    }

    @Override
    public SessionResponse saveWithRetry(SessionRequest sessionRequest) {
        for (long attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                log.info("Attempt {} to save schedule with ID: {}", attempt, sessionRequest.getId());
                return save(sessionRequest);
            } catch (ObjectOptimisticLockingFailureException | StaleObjectStateException e) {
                log.warn("Optimistic lock failure on attempt {} for scheduleId {}: {}",
                        attempt, sessionRequest.getId(), e.getMessage());
                if (attempt == retryAttempts) throw e;
            }
        }
        throw new ApplicationException(ErrorCode.GENERIC_ERROR);
    }

    @Override
    public void deleteById(Long id) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.SCHEDULE_NOT_FOUND));

        // Check if session has associated attendance records
        if (session.getAttendances() != null && !session.getAttendances().isEmpty()) {
            throw new ApplicationException(ErrorCode.SCHEDULE_HAS_ATTENDANCE_RECORDS);
        }

        sessionRepository.deleteById(id);
        log.info("Successfully deleted session with ID: {}", id);
    }

    private SessionResponse save(SessionRequest sessionRequest) {
        Session session;
        boolean isUpdate = sessionRequest.getId() != null;

        if (isUpdate) {
            session = sessionRepository.findById(sessionRequest.getId())
                    .orElseThrow(() -> new ApplicationException(ErrorCode.SCHEDULE_NOT_FOUND));
            sessionMapper.updateFromRequest(sessionRequest, session);
        } else {
            session = sessionMapper.toEntity(sessionRequest);
        }

        // Business rule validations
        validateBusinessRules(session, isUpdate);

        session = sessionRepository.save(session);

        log.info("Successfully {} schedule with ID: {} for session {} of course offering {}",
                isUpdate ? "updated" : "created", session.getId(),
                session.getSessionNumber(), session.getCourseOfferingId());

        return sessionMapper.toResponse(session);
    }

    private void validateBusinessRules(Session session, boolean isUpdate) {
        // 1. Validate time logic: startTime should be before endTime
        LocalDateTime startTime = session.getStartTime();
        LocalDateTime endTime = session.getEndTime();

        if (startTime != null && endTime != null) {
            if (startTime.isAfter(endTime)) {
                throw new ApplicationException(ErrorCode.INVALID_SCHEDULE_TIME);
            }
        }

        // 2. Validate course offering exists
        boolean courseOfferingValidation = enrollmentServiceClient.validateCourseOffering(session.getCourseOfferingId());

        if (!courseOfferingValidation) {
            throw new ApplicationException(ErrorCode.COURSE_OFFERING_NOT_FOUND);
        }

        // 3. Validate classroom exists and is available
        ClassroomValidationResponse classroomValidation = facilityServiceClient.validateClassroom(session.getClassroomId());

        if (!classroomValidation.isExists()) {
            throw new ApplicationException(ErrorCode.CLASSROOM_NOT_FOUND);
        }

        // 4. Check for schedule conflicts (same classroom, overlapping times)
        // TODO: Add custom repository method for conflict detection

        log.info("Validating business rules for schedule - Session: {}, CourseOffering: {}, Classroom: {}",
                session.getSessionNumber(), session.getCourseOfferingId(), session.getClassroomId());
    }
}