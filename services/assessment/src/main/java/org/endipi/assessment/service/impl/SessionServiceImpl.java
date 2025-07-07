package org.endipi.assessment.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.assessment.client.academicservice.AcademicServiceClient;
import org.endipi.assessment.client.enrollmentservice.EnrollmentServiceClient;
import org.endipi.assessment.client.facilityservice.FacilityServiceClient;
import org.endipi.assessment.dto.external.ClassroomDetailsResponse;
import org.endipi.assessment.dto.external.ClassroomValidationResponse;
import org.endipi.assessment.dto.external.CourseBasicInfo;
import org.endipi.assessment.dto.external.CourseOfferingDetailsResponse;
import org.endipi.assessment.dto.request.SessionRequest;
import org.endipi.assessment.dto.response.CourseSessionSummaryResponse;
import org.endipi.assessment.dto.response.SessionResponse;
import org.endipi.assessment.dto.response.SessionSummaryResponse;
import org.endipi.assessment.dto.response.SessionWithDetailsResponse;
import org.endipi.assessment.entity.Session;
import org.endipi.assessment.enums.error.ErrorCode;
import org.endipi.assessment.exception.ApplicationException;
import org.endipi.assessment.mapper.SessionMapper;
import org.endipi.assessment.repository.SessionRepository;
import org.endipi.assessment.service.SessionService;
import org.hibernate.StaleObjectStateException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SessionServiceImpl implements SessionService {
    private final SessionRepository sessionRepository;
    private final SessionMapper sessionMapper;
    private final EnrollmentServiceClient enrollmentServiceClient;
    private final FacilityServiceClient facilityServiceClient;
    private final AcademicServiceClient academicServiceClient;

    @Value("${retry.session.attempts}")
    private long retryAttempts;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

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

    @Override
    public Page<CourseSessionSummaryResponse> getOptimizedSessionSummary(int page, int size, String sort) {
        log.info("Getting optimized session summary with page: {}, size: {}, sort: {}", page, size, sort);

        Pageable pageable = PageRequest.of(page, size, Sort.by(sort.split(",")[0]).ascending());

        // Step 1: Get session counts by courseOfferingId
        Page<SessionSummaryResponse> sessionSummaries = sessionRepository.findSessionSummariesWithPaging(pageable);

        if (sessionSummaries.isEmpty()) {
            return sessionSummaries.map(summary -> CourseSessionSummaryResponse.builder().build());
        }

        // Step 2: Batch call to enrollment service for course offering details
        Set<Long> courseOfferingIds = sessionSummaries.stream()
                .map(SessionSummaryResponse::getCourseOfferingId)
                .collect(Collectors.toSet());

        log.info("Fetching course offering details for {} offerings", courseOfferingIds.size());
        Map<Long, CourseOfferingDetailsResponse> courseOfferingDetails =
                enrollmentServiceClient.getCourseOfferingDetailsByIds(courseOfferingIds);

        // Step 3: Extract courseIds and batch call to academic service
        Set<Long> courseIds = courseOfferingDetails.values().stream()
                .map(CourseOfferingDetailsResponse::getCourseId)
                .collect(Collectors.toSet());

        log.info("Fetching course basic info for {} courses", courseIds.size());
        Map<Long, CourseBasicInfo> courseInfo =
                academicServiceClient.getCourseBasicInfoByIds(courseIds);

        // Step 4: Combine all data
        return sessionSummaries.map(summary -> {
            CourseOfferingDetailsResponse offering = courseOfferingDetails.get(summary.getCourseOfferingId());
            if (offering == null) {
                log.warn("No course offering details found for ID: {}", summary.getCourseOfferingId());
                return CourseSessionSummaryResponse.builder()
                        .courseOfferingId(summary.getCourseOfferingId())
                        .totalSessionsRecorded(summary.getTotalSessions())
                        .build();
            }

            CourseBasicInfo course = courseInfo.get(offering.getCourseId());
            if (course == null) {
                log.warn("No course basic info found for ID: {}", offering.getCourseId());
            }

            return CourseSessionSummaryResponse.builder()
                    .courseOfferingId(summary.getCourseOfferingId())
                    .courseId(offering.getCourseId())
                    .courseName(course != null ? course.getName() : "Unknown Course")
                    .courseCode(course != null ? course.getCode() : "N/A")
                    .semesterName(offering.getSemesterName())
                    .teacherName(offering.getTeacherName())
                    .teacherEmail(offering.getTeacherEmail())
                    .totalSessionsRecorded(summary.getTotalSessions())
                    .build();
        });
    }

    @Override
    public List<SessionWithDetailsResponse> getSessionsWithDetailsByOffering(Long courseOfferingId) {
        log.info("Getting sessions with details for course offering: {}", courseOfferingId);

        List<Session> sessions = sessionRepository.findByCourseOfferingIdOrderBySessionNumberAsc(courseOfferingId);

        if (sessions.isEmpty()) {
            return List.of();
        }

        return enrichSessionsWithDetails(sessions);
    }

    @Override
    public Page<SessionWithDetailsResponse> getSessionsWithDetailsByOfferingWithPaging(Long courseOfferingId, int page, int size, String sort) {
        log.info("Getting sessions with details for course offering: {} with pagination", courseOfferingId);

        Pageable pageable = PageRequest.of(page, size, Sort.by(sort.split(",")[0]).ascending());
        Page<Session> sessions = sessionRepository.findByCourseOfferingId(courseOfferingId, pageable);

        if (sessions.isEmpty()) {
            return sessions.map(session -> SessionWithDetailsResponse.builder().build());
        }

        List<SessionWithDetailsResponse> enrichedSessions = enrichSessionsWithDetails(sessions.getContent());

        return sessions.map(session -> {
            return enrichedSessions.stream()
                    .filter(enriched -> enriched.getId().equals(session.getId()))
                    .findFirst()
                    .orElse(SessionWithDetailsResponse.builder().build());
        });
    }

    private List<SessionWithDetailsResponse> enrichSessionsWithDetails(List<Session> sessions) {
        // Get unique course offering IDs and classroom IDs
        Set<Long> courseOfferingIds = sessions.stream()
                .map(Session::getCourseOfferingId)
                .collect(Collectors.toSet());

        Set<Long> classroomIds = sessions.stream()
                .map(Session::getClassroomId)
                .collect(Collectors.toSet());

        // Batch fetch course offering details
        Map<Long, CourseOfferingDetailsResponse> courseOfferingDetails =
                enrollmentServiceClient.getCourseOfferingDetailsByIds(courseOfferingIds);

        // Batch fetch classroom details
        Map<Long, ClassroomDetailsResponse> classroomDetails =
                facilityServiceClient.getClassroomDetailsByIds(classroomIds);

        // Extract course IDs and batch fetch course info
        Set<Long> courseIds = courseOfferingDetails.values().stream()
                .map(CourseOfferingDetailsResponse::getCourseId)
                .collect(Collectors.toSet());

        Map<Long, CourseBasicInfo> courseInfo =
                academicServiceClient.getCourseBasicInfoByIds(courseIds);

        // Build enriched responses
        return sessions.stream().map(session -> {
            CourseOfferingDetailsResponse offering = courseOfferingDetails.get(session.getCourseOfferingId());
            ClassroomDetailsResponse classroom = classroomDetails.get(session.getClassroomId());
            CourseBasicInfo course = offering != null ? courseInfo.get(offering.getCourseId()) : null;

            return SessionWithDetailsResponse.builder()
                    .id(session.getId())
                    .sessionType(session.getSessionType().getSessionType())
                    .sessionNumber(session.getSessionNumber())
                    .startTime(session.getStartTime() != null ? session.getStartTime().format(FORMATTER) : null)
                    .endTime(session.getEndTime() != null ? session.getEndTime().format(FORMATTER) : null)
                    .courseOfferingId(session.getCourseOfferingId())
                    .classroomId(session.getClassroomId())
                    .courseName(course != null ? course.getName() : "Unknown Course")
                    .courseCode(course != null ? course.getCode() : "N/A")
                    .semesterName(offering != null ? offering.getSemesterName() : "Unknown Semester")
                    .teacherName(offering != null ? offering.getTeacherName() : "Unknown Teacher")
                    .teacherEmail(offering != null ? offering.getTeacherEmail() : "N/A")
                    .classroomName(classroom != null ? classroom.getName() : "Unknown Classroom")
                    .classroomType(classroom != null ? classroom.getClassroomType() : "N/A")
                    .build();
        }).collect(Collectors.toList());
    }
}