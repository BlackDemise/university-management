package org.endipi.assessment.mapper;

import org.endipi.assessment.dto.request.AttendanceRequest;
import org.endipi.assessment.dto.response.AttendanceResponse;
import org.endipi.assessment.entity.Attendance;
import org.endipi.assessment.repository.SessionRepository;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface AttendanceMapper {
    @Mapping(target = "attendanceStatus",
            expression = "java(org.endipi.assessment.enums.attendance.AttendanceStatus.valueOf(attendanceRequest.getAttendanceStatus()))")
    @Mapping(target = "session",
            expression = "java(sessionRepository.findById(attendanceRequest.getSessionId()).orElse(null))")
    Attendance toEntity(AttendanceRequest attendanceRequest, @Context SessionRepository sessionRepository);

    @Mapping(target = "attendanceStatus",
            expression = "java(attendance.getAttendanceStatus().getAttendanceStatus())")
    @Mapping(target = "scheduleId",
            expression = "java(attendance.getSession() != null ? attendance.getSession().getId() : null)")
    AttendanceResponse toResponse(Attendance attendance);

    @Mapping(target = "attendanceStatus",
            expression = "java(org.endipi.assessment.enums.attendance.AttendanceStatus.valueOf(attendanceRequest.getAttendanceStatus()))")
    @Mapping(target = "session",
            expression = "java(sessionRepository.findById(attendanceRequest.getSessionId()).orElse(null))")
    void updateFromRequest(AttendanceRequest attendanceRequest, @MappingTarget Attendance attendance,
                           @Context SessionRepository sessionRepository);
}