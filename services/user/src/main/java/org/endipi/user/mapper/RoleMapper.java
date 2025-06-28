package org.endipi.user.mapper;

import org.endipi.user.dto.response.RoleResponse;
import org.endipi.user.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "value",
            expression = "java(role.getRoleTitle().getRoleTitle())")
    @Mapping(target = "label",
            expression = "java(role.getRoleTitle().name())")
    RoleResponse toResponse(Role role);
}
