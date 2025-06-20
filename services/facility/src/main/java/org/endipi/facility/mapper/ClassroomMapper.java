package org.endipi.facility.mapper;

import org.endipi.facility.dto.request.ClassroomRequest;
import org.endipi.facility.dto.response.ClassroomResponse;
import org.endipi.facility.entity.Classroom;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface ClassroomMapper {
    @Mapping(target = "classroomType",
            expression = "java(org.endipi.facility.enums.classroom.ClassroomType.valueOf(classroomRequest.getClassroomType()))")
    Classroom toEntity(ClassroomRequest classroomRequest);

    @Mapping(target = "classroomType",
            expression = "java(classroom.getClassroomType().getClassroomType())")
    ClassroomResponse toResponse(Classroom classroom);

    @Mapping(target = "classroomType",
            expression = "java(org.endipi.facility.enums.classroom.ClassroomType.valueOf(classroomRequest.getClassroomType()))")
    void updateFromRequest(ClassroomRequest classroomRequest, @MappingTarget Classroom classroom);
}
