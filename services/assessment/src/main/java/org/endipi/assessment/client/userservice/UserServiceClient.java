package org.endipi.assessment.client.userservice;

import org.endipi.assessment.client.common.ClientConfig;
import org.endipi.assessment.dto.external.StudentValidationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "user-service",                                                // Service name in Eureka
        path = "/api/v1/user",                                                // Base path
        configuration = {ClientConfig.class, UserServiceClientConfig.class}   // Custom configuration
)
public interface UserServiceClient {
    @GetMapping("/students/{studentId}/validate")
    StudentValidationResponse validateStudent(@PathVariable Long studentId);
}
