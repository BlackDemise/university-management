package org.endipi.assessment.client.facilityservice;

import org.endipi.assessment.client.common.ClientConfig;
import org.endipi.assessment.dto.external.ClassroomValidationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "facility-service",  // Service name in Eureka
        path = "/api/v1/classroom", // Base path for the facility service
        configuration = {ClientConfig.class, FacilityServiceClientConfig.class} // Custom configuration for the client
)
public interface FacilityServiceClient {
    @GetMapping("/validate/{classroomId}")
    ClassroomValidationResponse validateClassroom(@PathVariable Long classroomId); // Endpoint to validate a classroom by its ID
}
