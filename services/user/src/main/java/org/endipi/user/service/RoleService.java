package org.endipi.user.service;

import org.endipi.user.dto.response.RoleResponse;

import java.util.List;

public interface RoleService {
    List<RoleResponse> findAll();
}
