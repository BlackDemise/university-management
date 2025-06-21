package org.endipi.assessment.mapper;

import org.endipi.assessment.dto.request.ScheduleRequest;
import org.endipi.assessment.dto.response.ScheduleResponse;
import org.endipi.assessment.entity.Schedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface ScheduleMapper {
    @Mapping(target = "sessionType",
            expression = "java(org.endipi.assessment.enums.schedule.SessionType.valueOf(scheduleRequest.getSessionType()))")
    @Mapping(target = "attendances", ignore = true)
    Schedule toEntity(ScheduleRequest scheduleRequest);

    @Mapping(target = "sessionType",
            expression = "java(schedule.getSessionType().getSessionType())")
    ScheduleResponse toResponse(Schedule schedule);

    @Mapping(target = "sessionType",
            expression = "java(org.endipi.assessment.enums.schedule.SessionType.valueOf(scheduleRequest.getSessionType()))")
    @Mapping(target = "attendances", ignore = true)
    void updateFromRequest(ScheduleRequest scheduleRequest, @MappingTarget Schedule schedule);
}