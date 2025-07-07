package org.endipi.user.mapper;

import org.endipi.user.dto.request.UserRequest;
import org.endipi.user.dto.response.UserResponse;
import org.endipi.user.dto.s2s.S2SStudentResponse;
import org.endipi.user.dto.s2s.S2STeacherResponse;
import org.endipi.user.entity.User;
import org.endipi.user.repository.RoleRepository;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring", uses = {TeacherMapper.class, StudentMapper.class})
public interface UserMapper {
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "teacher", ignore = true)
    @Mapping(target = "student", ignore = true)
    @Mapping(target = "role",
            expression = "java(roleRepository.findByRoleTitle(org.endipi.user.enums.role.RoleTitle.valueOf(userRequest.getRole())).orElse(null))")
    User toEntity(UserRequest userRequest,
                  @Context RoleRepository roleRepository);

    @Mapping(target = "displayedRole",
            expression = "java(user.getRole().getRoleTitle().getRoleTitle())")
    @Mapping(target = "teacherResponse", source = "teacher")
    @Mapping(target = "studentResponse", source = "student")
    @Mapping(target = "role",
            expression = "java(user.getRole().getRoleTitle().name())")
    UserResponse toResponse(User user);

    @Mapping(target = "teacher", ignore = true)
    @Mapping(target = "student", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "role",
            expression = "java(roleRepository.findByRoleTitle(org.endipi.user.enums.role.RoleTitle.valueOf(userRequest.getRole())).orElse(null))")
    void updateFromRequest(UserRequest userRequest, @MappingTarget User user, @Context RoleRepository roleRepository);

    /// S2S mapping
    @Mapping(target = "teacherName", source = "user.fullName")
    @Mapping(target = "teacherId", source = "user.id")
    @Mapping(target = "teacherEmail", source = "user.email")
    @Mapping(target = "teacherCode", source = "user.teacher.teacherCode")
    S2STeacherResponse toS2SResponse(User user);

    @Mapping(target = "studentName", source = "user.fullName")
    @Mapping(target = "studentId", source = "user.student.id")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "studentEmail", source = "user.email")
    @Mapping(target = "studentCode", source = "user.student.studentCode")
    @Mapping(target = "studentStatus", expression = "java(user.getStudent().getStudentStatus().getStudentStatus())")
    @Mapping(target = "courseYear", source = "user.student.courseYear")
    @Mapping(target = "majorId", source = "user.student.majorId")
    S2SStudentResponse toS2SStudentResponse(User user);
}
