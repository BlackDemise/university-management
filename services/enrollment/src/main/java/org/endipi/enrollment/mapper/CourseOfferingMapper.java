package org.endipi.enrollment.mapper;

import org.endipi.enrollment.dto.request.CourseOfferingRequest;
import org.endipi.enrollment.dto.response.CourseOfferingResponse;
import org.endipi.enrollment.entity.CourseOffering;
import org.endipi.enrollment.repository.SemesterRepository;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface CourseOfferingMapper {
    @Mapping(target = "semester",
            expression = "java(semesterRepository.findById(courseOfferingRequest.getSemesterId()).orElseThrow(() -> new org.endipi.enrollment.exception.ApplicationException(org.endipi.enrollment.enums.error.ErrorCode.SEMESTER_NOT_FOUND)))")
    @Mapping(target = "courseRegistrations", ignore = true)
    CourseOffering toEntity(CourseOfferingRequest courseOfferingRequest, @Context SemesterRepository semesterRepository);

    @Mapping(target = "semesterId", source = "semester.id")
    CourseOfferingResponse toResponse(CourseOffering courseOffering);

    @Mapping(target = "semester",
            expression = "java(semesterRepository.findById(courseOfferingRequest.getSemesterId()).orElseThrow(() -> new org.endipi.enrollment.exception.ApplicationException(org.endipi.enrollment.enums.error.ErrorCode.SEMESTER_NOT_FOUND)))")
    @Mapping(target = "courseRegistrations", ignore = true)
    void updateFromRequest(CourseOfferingRequest courseOfferingRequest, @MappingTarget CourseOffering courseOffering, @Context SemesterRepository semesterRepository);
}
