package org.endipi.enrollment.client.userservice;

import org.endipi.enrollment.client.common.ClientConfig;
import org.endipi.enrollment.dto.external.StudentValidationResponse;
import org.endipi.enrollment.dto.external.TeacherValidationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "user-service",                                              // Service name in Eureka
        path = "/api/v1/user",                                              // Base path
        configuration = {ClientConfig.class, UserServiceClientConfig.class} // Custom configuration
)
public interface UserServiceClient {
    @GetMapping("/teachers/{teacherId}/validate")
    TeacherValidationResponse validateTeacher(@PathVariable Long teacherId);

    @GetMapping("/students/{studentId}/validate")
    StudentValidationResponse validateStudent(@PathVariable Long studentId);
}
