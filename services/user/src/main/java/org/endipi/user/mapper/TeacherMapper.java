package org.endipi.user.mapper;

import org.endipi.user.dto.request.TeacherRequest;
import org.endipi.user.dto.response.TeacherResponse;
import org.endipi.user.entity.Teacher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface TeacherMapper {
    @Mapping(target = "user", ignore = true)
    Teacher toEntity(TeacherRequest teacherRequest);

    TeacherResponse toResponse(Teacher teacher);

    @Mapping(target = "user", ignore = true)
    void updateFromRequest(TeacherRequest teacherRequest, @MappingTarget Teacher teacher);
}
