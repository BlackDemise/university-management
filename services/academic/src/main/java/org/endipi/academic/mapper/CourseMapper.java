package org.endipi.academic.mapper;

import org.endipi.academic.dto.request.CourseRequest;
import org.endipi.academic.dto.response.CourseResponse;
import org.endipi.academic.entity.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface CourseMapper {
    @Mapping(target = "requiredBy", ignore = true)
    @Mapping(target = "programCurriculums", ignore = true)
    @Mapping(target = "prerequisites", ignore = true)
    @Mapping(target = "courseType",
            expression = "java(org.endipi.academic.enums.course.CourseType.valueOf(courseRequest.getCourseType()))")
    Course toEntity(CourseRequest courseRequest);

    @Mapping(target = "courseTypeEnum",
            expression = "java(course.getCourseType().name())")
    @Mapping(target = "courseType",
            expression = "java(course.getCourseType().getCourseType())")
    CourseResponse toResponse(Course course);

    @Mapping(target = "requiredBy", ignore = true)
    @Mapping(target = "programCurriculums", ignore = true)
    @Mapping(target = "prerequisites", ignore = true)
    @Mapping(target = "courseType",
            expression = "java(org.endipi.academic.enums.course.CourseType.valueOf(courseRequest.getCourseType()))")
    void updateFromRequest(CourseRequest courseRequest, @MappingTarget Course course);
}
