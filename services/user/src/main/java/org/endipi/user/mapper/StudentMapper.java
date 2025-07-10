package org.endipi.user.mapper;

import org.endipi.user.dto.request.StudentRequest;
import org.endipi.user.dto.response.StudentResponse;
import org.endipi.user.entity.Student;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface StudentMapper {
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "studentStatus",
            expression = "java(org.endipi.user.enums.student.StudentStatus.valueOf(studentRequest.getStudentStatus()))")
    Student toEntity(StudentRequest studentRequest);

    StudentResponse toResponse(Student student);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "studentStatus",
            expression = "java(org.endipi.user.enums.student.StudentStatus.valueOf(studentRequest.getStudentStatus()))")
    void updateFromRequest(StudentRequest studentRequest, @MappingTarget Student student);
}
