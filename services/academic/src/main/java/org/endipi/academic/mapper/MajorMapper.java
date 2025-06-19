package org.endipi.academic.mapper;

import org.endipi.academic.dto.request.MajorRequest;
import org.endipi.academic.dto.response.MajorResponse;
import org.endipi.academic.entity.Major;
import org.endipi.academic.repository.DepartmentRepository;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring", uses = {DepartmentMapper.class})
public interface MajorMapper {
    @Mapping(target = "programCurriculums", ignore = true)
    @Mapping(target = "department",
            expression = "java(departmentRepository.findById(majorRequest.getDepartmentId()).orElseThrow(() -> new org.endipi.academic.exception.ApplicationException(org.endipi.academic.enums.error.ErrorCode.DEPARTMENT_NOT_FOUND)))")
    Major toEntity(MajorRequest majorRequest, @Context DepartmentRepository departmentRepository);

    @Mapping(target = "departmentResponse", source = "department")
    MajorResponse toResponse(Major major);

    @Mapping(target = "programCurriculums", ignore = true)
    @Mapping(target = "department", expression = "java(departmentRepository.findById(request.getDepartmentId()).orElseThrow(() -> new org.endipi.academic.exception.ApplicationException(org.endipi.academic.enums.error.ErrorCode.DEPARTMENT_NOT_FOUND)))")
    void updateFromRequest(MajorRequest request, @MappingTarget Major entity, @Context DepartmentRepository departmentRepository);
}
