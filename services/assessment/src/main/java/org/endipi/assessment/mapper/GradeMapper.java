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
    @Mapping(target = "scoreType",
            expression = "java(org.endipi.assessment.enums.score.ScoreType.valueOf(gradeRequest.getScoreType()))")
    Grade toEntity(GradeRequest gradeRequest);

    @Mapping(target = "scoreType",
            expression = "java(grade.getScoreType().getScoreType())")
    GradeResponse toResponse(Grade grade);

    @Mapping(target = "scoreType",
            expression = "java(org.endipi.assessment.enums.score.ScoreType.valueOf(gradeRequest.getScoreType()))")
    void updateFromRequest(GradeRequest gradeRequest, @MappingTarget Grade grade);
}
