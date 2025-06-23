package org.endipi.assessment.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.assessment.client.userservice.UserServiceClient;
import org.endipi.assessment.dto.external.StudentValidationResponse;
import org.endipi.assessment.dto.request.AttendanceRequest;
import org.endipi.assessment.dto.response.AttendanceResponse;
import org.endipi.assessment.entity.Attendance;
import org.endipi.assessment.enums.error.ErrorCode;
import org.endipi.assessment.exception.ApplicationException;
import org.endipi.assessment.mapper.AttendanceMapper;
import org.endipi.assessment.repository.AttendanceRepository;
import org.endipi.assessment.repository.ScheduleRepository;
import org.endipi.assessment.service.AttendanceService;
import org.hibernate.StaleObjectStateException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {
    private final UserServiceClient userServiceClient;
    private final AttendanceRepository attendanceRepository;
    private final AttendanceMapper attendanceMapper;
    private final ScheduleRepository scheduleRepository;

    @Value("${retry.attendance.attempts}")
    private long retryAttempts;

    @Override
    public List<AttendanceResponse> findAll() {
        return attendanceRepository.findAll()
                .stream()
                .map(attendanceMapper::toResponse)
                .toList();
    }

    @Override
    public AttendanceResponse findById(Long id) {
        return attendanceRepository.findById(id)
                .map(attendanceMapper::toResponse)
                .orElseThrow(() -> new ApplicationException(ErrorCode.ATTENDANCE_NOT_FOUND));
    }

    @Override
    public AttendanceResponse saveWithRetry(AttendanceRequest attendanceRequest) {
        for (long attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                log.info("Attempt {} to save attendance with ID: {}", attempt, attendanceRequest.getId());
                return save(attendanceRequest);
            } catch (ObjectOptimisticLockingFailureException | StaleObjectStateException e) {
                log.warn("Optimistic lock failure on attempt {} for attendanceId {}: {}",
                        attempt, attendanceRequest.getId(), e.getMessage());
                if (attempt == retryAttempts) throw e;
            }
        }
        throw new ApplicationException(ErrorCode.GENERIC_ERROR);
    }

    @Override
    public void deleteById(Long id) {
        if (!attendanceRepository.existsById(id)) {
            log.warn("Attempted to delete non-existent attendance with ID: {}", id);
            throw new ApplicationException(ErrorCode.ATTENDANCE_NOT_FOUND);
        }

        attendanceRepository.deleteById(id);
        log.info("Successfully deleted attendance with ID: {}", id);
    }

    private AttendanceResponse save(AttendanceRequest attendanceRequest) {
        Attendance attendance;
        boolean isUpdate = attendanceRequest.getId() != null;

        if (isUpdate) {
            attendance = attendanceRepository.findById(attendanceRequest.getId())
                    .orElseThrow(() -> new ApplicationException(ErrorCode.ATTENDANCE_NOT_FOUND));
            attendanceMapper.updateFromRequest(attendanceRequest, attendance, scheduleRepository);
        } else {
            attendance = attendanceMapper.toEntity(attendanceRequest, scheduleRepository);
        }

        // ==== Business rule validations ==== //
        if (!validateAttendanceTimeWindow(attendance)) {
            throw new ApplicationException(ErrorCode.ATTENDANCE_TIME_WINDOW_EXPIRED);
        }

        validateBusinessRules(attendanceRequest, isUpdate);
        // ==== Business rule validations ==== //

        attendance = attendanceRepository.save(attendance);

        log.info("Successfully {} attendance with ID: {} for student: {} in schedule: {}",
                isUpdate ? "updated" : "created", attendance.getId(),
                attendance.getStudentId(), attendance.getSchedule().getId());

        return attendanceMapper.toResponse(attendance);
    }

    /// Validate attendance window
    private boolean validateAttendanceTimeWindow(Attendance attendance) {
        LocalDateTime now = LocalDateTime.now();

        LocalDateTime endTime = attendance.getSchedule().getClassDuration().getEndTime().atStartOfDay();

        if (now.isAfter(endTime)) {
            log.warn("Attendance time window has expired for attendance ID: {}", attendance.getId());
            return false;
        }
        return true;
    }

    private void validateBusinessRules(AttendanceRequest attendanceRequest, boolean isUpdate) {
        // 1: Validate student exists
        StudentValidationResponse validation = userServiceClient.validateStudent(attendanceRequest.getStudentId());

        if (!validation.isExists()) {
            log.warn("Invalid student ID: {} for attendance request", attendanceRequest.getStudentId());
            throw new ApplicationException(ErrorCode.USER_NOT_FOUND);
        }

        if (!validation.isStudent()) {
            log.warn("User ID: {} is not a student", attendanceRequest.getStudentId());
            throw new ApplicationException(ErrorCode.USER_NOT_A_STUDENT);
        }

        // 2: Validate schedule exists
        if (!scheduleRepository.existsById(attendanceRequest.getScheduleId())) {
            log.warn("Invalid schedule ID: {} for attendance request", attendanceRequest.getScheduleId());
            throw new ApplicationException(ErrorCode.SCHEDULE_NOT_FOUND);
        }

        // 3. Check for duplicate attendance (same student, same schedule)
         if (!isUpdate) {
             boolean exists = attendanceRepository.existsByStudentIdAndScheduleId(
                 attendanceRequest.getStudentId(),
                 attendanceRequest.getScheduleId()
             );
             if (exists) {
                 throw new ApplicationException(ErrorCode.DUPLICATE_ATTENDANCE_RECORD);
             }
         }

         // 4.

        log.info("Validating business rules for attendance - Student: {}, Schedule: {}, Status: {}",
                attendanceRequest.getStudentId(), attendanceRequest.getScheduleId(), attendanceRequest.getAttendanceStatus());
    }
}