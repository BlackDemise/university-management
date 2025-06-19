package org.endipi.academic.mapper;

import org.endipi.academic.dto.request.DepartmentMemberRequest;
import org.endipi.academic.dto.response.DepartmentMemberResponse;
import org.endipi.academic.entity.DepartmentMember;
import org.endipi.academic.repository.DepartmentRepository;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface DepartmentMemberMapper {
    @Mapping(target = "department",
            expression = "java(departmentRepository.findById(departmentMemberRequest.getDepartmentId()).orElseThrow(() -> new org.endipi.academic.exception.ApplicationException(org.endipi.academic.enums.error.ErrorCode.DEPARTMENT_NOT_FOUND)))")
    @Mapping(target = "departmentMemberType",
            expression = "java(org.endipi.academic.enums.department.DepartmentMemberType.valueOf(departmentMemberRequest.getDepartmentMemberType()))")
    DepartmentMember toEntity(DepartmentMemberRequest departmentMemberRequest, @Context DepartmentRepository departmentRepository);

    @Mapping(target = "departmentMemberType",
            expression = "java(departmentMember.getDepartmentMemberType().getDepartmentMemberType())")
    @Mapping(target = "departmentId",
            expression = "java(departmentMember.getDepartment().getId())")
    DepartmentMemberResponse toResponse(DepartmentMember departmentMember);

    @Mapping(target = "department",
            expression = "java(departmentRepository.findById(departmentMemberRequest.getDepartmentId()).orElseThrow(() -> new org.endipi.academic.exception.ApplicationException(org.endipi.academic.enums.error.ErrorCode.DEPARTMENT_NOT_FOUND)))")
    @Mapping(target = "departmentMemberType",
            expression = "java(org.endipi.academic.enums.department.DepartmentMemberType.valueOf(departmentMemberRequest.getDepartmentMemberType()))")
    void updateFromRequest(DepartmentMemberRequest departmentMemberRequest, @MappingTarget DepartmentMember departmentMember, @Context DepartmentRepository departmentRepository);
}
