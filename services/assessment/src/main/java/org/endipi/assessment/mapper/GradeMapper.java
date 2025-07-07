package org.endipi.assessment.mapper;

import org.endipi.assessment.dto.request.GradeRequest;
import org.endipi.assessment.dto.response.GradeResponse;
import org.endipi.assessment.entity.Grade;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface GradeMapper {
    @Mapping(target = "gradeType",
            expression = "java(org.endipi.assessment.enums.grade.GradeType.valueOf(gradeRequest.getGradeType()))")
    Grade toEntity(GradeRequest gradeRequest);

    @Mapping(target = "gradeType",
            expression = "java(grade.getGradeType().getGradeType())")
    GradeResponse toResponse(Grade grade);

    @Mapping(target = "gradeType",
            expression = "java(org.endipi.assessment.enums.grade.GradeType.valueOf(gradeRequest.getGradeType()))")
    void updateFromRequest(GradeRequest gradeRequest, @MappingTarget Grade grade);
}
