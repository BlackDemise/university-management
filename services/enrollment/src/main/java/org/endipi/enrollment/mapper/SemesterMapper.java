package org.endipi.enrollment.mapper;

import org.endipi.enrollment.dto.request.SemesterRequest;
import org.endipi.enrollment.dto.response.SemesterResponse;
import org.endipi.enrollment.entity.Semester;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface SemesterMapper {
    @Mapping(target = "courseOfferings", ignore = true)
    Semester toEntity(SemesterRequest semesterRequest);

    SemesterResponse toResponse(Semester semester);

    @Mapping(target = "courseOfferings", ignore = true)
    void updateFromRequest(SemesterRequest semesterRequest, @MappingTarget Semester semester);
}
