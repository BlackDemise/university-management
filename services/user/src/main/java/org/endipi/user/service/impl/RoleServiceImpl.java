package org.endipi.user.service.impl;

import lombok.RequiredArgsConstructor;
import org.endipi.user.dto.response.RoleResponse;
import org.endipi.user.mapper.RoleMapper;
import org.endipi.user.repository.RoleRepository;
import org.endipi.user.service.RoleService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    @Override
    public List<RoleResponse> findAll() {
        return roleRepository.findAll()
                .stream()
                .map(roleMapper::toResponse)
                .toList();
    }
}
