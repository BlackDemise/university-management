package org.endipi.assessment.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.assessment.dto.request.ScheduleRequest;
import org.endipi.assessment.dto.response.ScheduleResponse;
import org.endipi.assessment.entity.Schedule;
import org.endipi.assessment.enums.error.ErrorCode;
import org.endipi.assessment.exception.ApplicationException;
import org.endipi.assessment.mapper.ScheduleMapper;
import org.endipi.assessment.repository.ClassDurationRepository;
import org.endipi.assessment.repository.ScheduleRepository;
import org.endipi.assessment.service.ScheduleService;
import org.hibernate.StaleObjectStateException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduleServiceImpl implements ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final ScheduleMapper scheduleMapper;
    private final ClassDurationRepository classDurationRepository;

    @Value("${retry.schedule.attempts}")
    private long retryAttempts;

    @Override
    public List<ScheduleResponse> findAll() {
        return scheduleRepository.findAll()
                .stream()
                .map(scheduleMapper::toResponse)
                .toList();
    }

    @Override
    public ScheduleResponse findById(Long id) {
        return scheduleRepository.findById(id)
                .map(scheduleMapper::toResponse)
                .orElseThrow(() -> new ApplicationException(ErrorCode.SCHEDULE_NOT_FOUND));
    }

    @Override
    public ScheduleResponse saveWithRetry(ScheduleRequest scheduleRequest) {
        for (long attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                log.info("Attempt {} to save schedule with ID: {}", attempt, scheduleRequest.getId());
                return save(scheduleRequest);
            } catch (ObjectOptimisticLockingFailureException | StaleObjectStateException e) {
                log.warn("Optimistic lock failure on attempt {} for scheduleId {}: {}",
                        attempt, scheduleRequest.getId(), e.getMessage());
                if (attempt == retryAttempts) throw e;
            }
        }
        throw new ApplicationException(ErrorCode.GENERIC_ERROR);
    }

    @Override
    public void deleteById(Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.SCHEDULE_NOT_FOUND));

        // Check if schedule has associated attendance records
        if (schedule.getAttendances() != null && !schedule.getAttendances().isEmpty()) {
            throw new ApplicationException(ErrorCode.SCHEDULE_HAS_ATTENDANCE_RECORDS);
        }

        scheduleRepository.deleteById(id);
        log.info("Successfully deleted schedule with ID: {}", id);
    }

    private ScheduleResponse save(ScheduleRequest scheduleRequest) {
        Schedule schedule;
        boolean isUpdate = scheduleRequest.getId() != null;

        if (isUpdate) {
            schedule = scheduleRepository.findById(scheduleRequest.getId())
                    .orElseThrow(() -> new ApplicationException(ErrorCode.SCHEDULE_NOT_FOUND));
            scheduleMapper.updateFromRequest(scheduleRequest, schedule, classDurationRepository);
        } else {
            schedule = scheduleMapper.toEntity(scheduleRequest, classDurationRepository);
        }

        // Business rule validations
        validateBusinessRules(schedule, isUpdate);

        schedule = scheduleRepository.save(schedule);

        log.info("Successfully {} schedule with ID: {} for session {} of course offering {}",
                isUpdate ? "updated" : "created", schedule.getId(),
                schedule.getSessionNumber(), schedule.getCourseOfferingId());

        return scheduleMapper.toResponse(schedule);
    }

    private void validateBusinessRules(Schedule schedule, boolean isUpdate) {
        // 1. Validate time logic: startTime should be before endTime
        LocalDate startTime = schedule.getClassDuration().getStartTime();
        LocalDate endTime = schedule.getClassDuration().getEndTime();

        if (startTime != null && endTime != null) {
            if (startTime.isAfter(endTime)) {
                throw new ApplicationException(ErrorCode.INVALID_SCHEDULE_TIME);
            }
        }

        // 2. TODO: Validate course offering exists
        // CourseOfferingValidationResponse validation = enrollmentServiceClient.validateCourseOffering(schedule.getCourseOfferingId());

        // 3. TODO: Validate classroom exists and is available
        // ClassroomValidationResponse classroomValidation = facilityServiceClient.validateClassroom(schedule.getClassroomId());

        // 4. Check for schedule conflicts (same classroom, overlapping times)
        // TODO: Add custom repository method for conflict detection

        log.info("Validating business rules for schedule - Session: {}, CourseOffering: {}, Classroom: {}",
                schedule.getSessionNumber(), schedule.getCourseOfferingId(), schedule.getClassroomId());
    }
}