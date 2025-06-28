package org.endipi.user.resource;

import lombok.RequiredArgsConstructor;
import org.endipi.user.dto.response.ApiResponse;
import org.endipi.user.dto.response.RoleResponse;
import org.endipi.user.service.RoleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/role")
public class RoleResource {
    private final RoleService roleService;

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        List<RoleResponse> roles = roleService.findAll();

        ApiResponse<String, List<RoleResponse>> apiResponse = ApiResponse.<String, List<RoleResponse>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(roles)
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
