package org.endipi.assessment.mapper;

import org.endipi.assessment.dto.request.ScheduleRequest;
import org.endipi.assessment.dto.response.ScheduleResponse;
import org.endipi.assessment.entity.Schedule;
import org.endipi.assessment.repository.ClassDurationRepository;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface ScheduleMapper {
    @Mapping(target = "classDuration",
            expression = "java(classDurationRepository.findById(scheduleRequest.getClassDurationId()).orElse(null))")
    @Mapping(target = "sessionType",
            expression = "java(org.endipi.assessment.enums.schedule.SessionType.valueOf(scheduleRequest.getSessionType()))")
    @Mapping(target = "attendances", ignore = true)
    Schedule toEntity(ScheduleRequest scheduleRequest, @Context ClassDurationRepository classDurationRepository);

    @Mapping(target = "startTime",
            expression = "java(schedule.getClassDuration() != null ? schedule.getClassDuration().getStartTime().toString() : null)")
    @Mapping(target = "endTime",
            expression = "java(schedule.getClassDuration() != null ? schedule.getClassDuration().getEndTime().toString() : null)")
    @Mapping(target = "sessionType",
            expression = "java(schedule.getSessionType().getSessionType())")
    ScheduleResponse toResponse(Schedule schedule);

    @Mapping(target = "sessionType",
            expression = "java(org.endipi.assessment.enums.schedule.SessionType.valueOf(scheduleRequest.getSessionType()))")
    @Mapping(target = "attendances", ignore = true)
    @Mapping(target = "classDuration",
            expression = "java(classDurationRepository.findById(scheduleRequest.getClassDurationId()).orElse(null))")
    void updateFromRequest(ScheduleRequest scheduleRequest, @MappingTarget Schedule schedule, @Context ClassDurationRepository classDurationRepository);
}