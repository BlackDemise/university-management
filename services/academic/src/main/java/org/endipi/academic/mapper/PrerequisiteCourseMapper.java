package org.endipi.academic.mapper;

import org.endipi.academic.dto.request.PrerequisiteCourseRequest;
import org.endipi.academic.dto.response.PrerequisiteCourseResponse;
import org.endipi.academic.entity.PrerequisiteCourse;
import org.endipi.academic.repository.CourseRepository;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface PrerequisiteCourseMapper {
    @Mapping(target = "prerequisiteCourse",
            expression = "java(courseRepository.findById(prerequisiteCourseRequest.getPrerequisiteCourseId()).orElseThrow(() -> new org.endipi.academic.exception.ApplicationException(org.endipi.academic.enums.error.ErrorCode.COURSE_NOT_FOUND)))")
    @Mapping(target = "course",
            expression = "java(courseRepository.findById(prerequisiteCourseRequest.getCourseId()).orElseThrow(() -> new org.endipi.academic.exception.ApplicationException(org.endipi.academic.enums.error.ErrorCode.COURSE_NOT_FOUND)))")
    PrerequisiteCourse toEntity(PrerequisiteCourseRequest prerequisiteCourseRequest, @Context CourseRepository courseRepository);

    @Mapping(target = "prerequisiteCourseId",
            expression = "java(prerequisiteCourse.getPrerequisiteCourse().getId())")
    @Mapping(target = "courseId",
            expression = "java(prerequisiteCourse.getCourse().getId())")
    PrerequisiteCourseResponse toResponse(PrerequisiteCourse prerequisiteCourse);

    @Mapping(target = "prerequisiteCourse",
            expression = "java(courseRepository.findById(prerequisiteCourseRequest.getPrerequisiteCourseId()).orElseThrow(() -> new org.endipi.academic.exception.ApplicationException(org.endipi.academic.enums.error.ErrorCode.COURSE_NOT_FOUND)))")
    @Mapping(target = "course",
            expression = "java(courseRepository.findById(prerequisiteCourseRequest.getCourseId()).orElseThrow(() -> new org.endipi.academic.exception.ApplicationException(org.endipi.academic.enums.error.ErrorCode.COURSE_NOT_FOUND)))")
    void updateFromRequest(PrerequisiteCourseRequest prerequisiteCourseRequest, @MappingTarget PrerequisiteCourse prerequisiteCourse, @Context CourseRepository courseRepository);
}
