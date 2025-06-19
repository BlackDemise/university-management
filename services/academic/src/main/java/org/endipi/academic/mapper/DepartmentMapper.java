package org.endipi.academic.mapper;

import org.endipi.academic.dto.request.DepartmentRequest;
import org.endipi.academic.dto.response.DepartmentResponse;
import org.endipi.academic.entity.Department;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface DepartmentMapper {
    @Mapping(target = "majors", ignore = true)
    @Mapping(target = "departmentMembers", ignore = true)
    Department toEntity(DepartmentRequest departmentRequest);

    DepartmentResponse toResponse(Department department);

    @Mapping(target = "majors", ignore = true)
    @Mapping(target = "departmentMembers", ignore = true)
    void updateFromRequest(DepartmentRequest departmentRequest, @MappingTarget Department department);
}
