package org.endipi.academic.mapper;

import org.endipi.academic.dto.request.ProgramCurriculumRequest;
import org.endipi.academic.dto.response.ProgramCurriculumResponse;
import org.endipi.academic.entity.ProgramCurriculum;
import org.endipi.academic.repository.CourseRepository;
import org.endipi.academic.repository.MajorRepository;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface ProgramCurriculumMapper {
    @Mapping(target = "major",
            expression = "java(majorRepository.findById(programCurriculumRequest.getMajorId()).orElseThrow(() -> new org.endipi.academic.exception.ApplicationException(org.endipi.academic.enums.error.ErrorCode.MAJOR_NOT_FOUND)))")
    @Mapping(target = "course",
            expression = "java(courseRepository.findById(programCurriculumRequest.getCourseId()).orElseThrow(() -> new org.endipi.academic.exception.ApplicationException(org.endipi.academic.enums.error.ErrorCode.COURSE_NOT_FOUND)))")
    ProgramCurriculum toEntity(ProgramCurriculumRequest programCurriculumRequest, @Context MajorRepository majorRepository, @Context CourseRepository courseRepository);

    @Mapping(target = "majorId",
            expression = "java(programCurriculum.getMajor().getId())")
    @Mapping(target = "courseId",
            expression = "java(programCurriculum.getCourse().getId())")
    ProgramCurriculumResponse toResponse(ProgramCurriculum programCurriculum);

    @Mapping(target = "major",
            expression = "java(majorRepository.findById(programCurriculumRequest.getMajorId()).orElseThrow(() -> new org.endipi.academic.exception.ApplicationException(org.endipi.academic.enums.error.ErrorCode.MAJOR_NOT_FOUND)))")
    @Mapping(target = "course",
            expression = "java(courseRepository.findById(programCurriculumRequest.getCourseId()).orElseThrow(() -> new org.endipi.academic.exception.ApplicationException(org.endipi.academic.enums.error.ErrorCode.COURSE_NOT_FOUND)))")
    void updateFromRequest(ProgramCurriculumRequest programCurriculumRequest, @MappingTarget ProgramCurriculum programCurriculum, @Context MajorRepository majorRepository, @Context CourseRepository courseRepository);
}
