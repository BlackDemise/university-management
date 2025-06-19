package org.endipi.academic.client.userservice;

import org.endipi.academic.dto.external.TeacherValidationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "user-service",                           // Service name in Eureka
        path = "/api/v1/user",                          // Base path
        configuration = UserServiceClientConfig.class   // Custom configuration
)
public interface UserServiceClient {
    @GetMapping("/teachers/{teacherId}/validate")
    TeacherValidationResponse validateTeacher(@PathVariable Long teacherId);
}
