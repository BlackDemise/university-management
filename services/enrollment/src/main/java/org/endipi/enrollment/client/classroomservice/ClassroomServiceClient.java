package org.endipi.enrollment.client.classroomservice;

import org.endipi.enrollment.client.common.ClientConfig;
import org.endipi.enrollment.dto.external.ClassroomValidationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "facility-service",
        path = "/api/v1/classroom",
        configuration = {ClientConfig.class, ClassroomServiceClientConfig.class}
)
public interface ClassroomServiceClient {
    @GetMapping("/validate/{classroomId}")
    ClassroomValidationResponse validateClassroom(@PathVariable Long classroomId);
}
