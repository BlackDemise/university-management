package org.endipi.enrollment.mapper;

import org.endipi.enrollment.client.courseservice.CourseServiceClient;
import org.endipi.enrollment.client.userservice.UserServiceClient;
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
@Mapper(componentModel = "spring", uses = {SemesterMapper.class})
public interface CourseOfferingMapper {
    @Mapping(target = "semester",
            expression = "java(semesterRepository.findById(courseOfferingRequest.getSemesterId()).orElseThrow(() -> new org.endipi.enrollment.exception.ApplicationException(org.endipi.enrollment.enums.error.ErrorCode.SEMESTER_NOT_FOUND)))")
    @Mapping(target = "courseRegistrations", ignore = true)
    CourseOffering toEntity(CourseOfferingRequest courseOfferingRequest, @Context SemesterRepository semesterRepository);

    @Mapping(target = "teacherResponse",
             expression = "java(userServiceClient.getTeacherDetails(courseOffering.getTeacherId()))")
    @Mapping(target = "semesterResponse", source = "semester")
    @Mapping(target = "courseResponse",
             expression = "java(courseServiceClient.getCourseDetails(courseOffering.getCourseId()))")
    CourseOfferingResponse toResponse(CourseOffering courseOffering, @Context UserServiceClient userServiceClient, @Context CourseServiceClient courseServiceClient);

    @Mapping(target = "semester",
            expression = "java(semesterRepository.findById(courseOfferingRequest.getSemesterId()).orElseThrow(() -> new org.endipi.enrollment.exception.ApplicationException(org.endipi.enrollment.enums.error.ErrorCode.SEMESTER_NOT_FOUND)))")
    @Mapping(target = "courseRegistrations", ignore = true)
    void updateFromRequest(CourseOfferingRequest courseOfferingRequest, @MappingTarget CourseOffering courseOffering, @Context SemesterRepository semesterRepository);
}
