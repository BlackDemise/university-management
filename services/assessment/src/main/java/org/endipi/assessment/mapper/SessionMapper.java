package org.endipi.assessment.mapper;

import org.endipi.assessment.dto.request.SessionRequest;
import org.endipi.assessment.dto.response.SessionResponse;
import org.endipi.assessment.entity.Session;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface SessionMapper {
    @Mapping(target = "sessionType",
            expression = "java(org.endipi.assessment.enums.session.SessionType.valueOf(sessionRequest.getSessionType()))")
    @Mapping(target = "attendances", ignore = true)
    Session toEntity(SessionRequest sessionRequest);

    @Mapping(target = "sessionType",
            expression = "java(session.getSessionType().getSessionType())")
    SessionResponse toResponse(Session session);

    @Mapping(target = "sessionType",
            expression = "java(org.endipi.assessment.enums.session.SessionType.valueOf(sessionRequest.getSessionType()))")
    @Mapping(target = "attendances", ignore = true)
    void updateFromRequest(SessionRequest sessionRequest, @MappingTarget Session session);
}