package org.endipi.enrollment.mapper;

import org.endipi.enrollment.dto.request.CourseRegistrationRequest;
import org.endipi.enrollment.dto.response.CourseRegistrationResponse;
import org.endipi.enrollment.entity.CourseRegistration;
import org.endipi.enrollment.repository.CourseOfferingRepository;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface CourseRegistrationMapper {
    @Mapping(target = "courseOffering",
            expression = "java(courseOfferingRepository.findById(courseRegistrationRequest.getCourseOfferingId()).orElseThrow(() -> new org.endipi.enrollment.exception.ApplicationException(org.endipi.enrollment.enums.error.ErrorCode.COURSE_REGISTRATION_NOT_FOUND)))")
    @Mapping(target = "courseRegistrationStatus",
            expression = "java(org.endipi.enrollment.enums.course.CourseRegistrationStatus.valueOf(courseRegistrationRequest.getCourseRegistrationStatus()))")
    CourseRegistration toEntity(CourseRegistrationRequest courseRegistrationRequest, @Context CourseOfferingRepository courseOfferingRepository);

    @Mapping(target = "courseOfferingId", source = "courseOffering.id")
    CourseRegistrationResponse toResponse(CourseRegistration courseRegistration);

    @Mapping(target = "courseOffering",
            expression = "java(courseOfferingRepository.findById(courseRegistrationRequest.getCourseOfferingId()).orElseThrow(() -> new org.endipi.enrollment.exception.ApplicationException(org.endipi.enrollment.enums.error.ErrorCode.COURSE_REGISTRATION_NOT_FOUND)))")
    @Mapping(target = "courseRegistrationStatus",
            expression = "java(org.endipi.enrollment.enums.course.CourseRegistrationStatus.valueOf(courseRegistrationRequest.getCourseRegistrationStatus()))")
    void updateFromRequest(CourseRegistrationRequest courseRegistrationRequest, @MappingTarget CourseRegistration courseRegistration, @Context CourseOfferingRepository courseOfferingRepository);
}
