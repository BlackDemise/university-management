package org.endipi.assessment.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {
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

        // Business rule validations
        validateBusinessRules(attendanceRequest, isUpdate);

        attendance = attendanceRepository.save(attendance);

        log.info("Successfully {} attendance with ID: {} for student: {} in schedule: {}",
                isUpdate ? "updated" : "created", attendance.getId(),
                attendance.getStudentId(), attendance.getSchedule().getId());

        return attendanceMapper.toResponse(attendance);
    }

    private void validateBusinessRules(AttendanceRequest attendanceRequest, boolean isUpdate) {
        // 1. TODO: Validate student exists
        // StudentValidationResponse validation = userServiceClient.validateStudent(attendanceRequest.getStudentId());

        // 2. TODO: Validate schedule exists and is active
        // ScheduleValidationResponse scheduleValidation = validateSchedule(attendanceRequest.getScheduleId());

        // 3. Check for duplicate attendance (same student, same schedule)
        // if (!isUpdate) {
        //     boolean exists = attendanceRepository.existsByStudentIdAndScheduleId(
        //         attendanceRequest.getStudentId(),
        //         attendanceRequest.getScheduleId()
        //     );
        //     if (exists) {
        //         throw new ApplicationException(ErrorCode.DUPLICATE_ATTENDANCE_RECORD);
        //     }
        // }

        log.info("Validating business rules for attendance - Student: {}, Schedule: {}, Status: {}",
                attendanceRequest.getStudentId(), attendanceRequest.getScheduleId(), attendanceRequest.getAttendanceStatus());
    }
}