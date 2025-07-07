package org.endipi.assessment.client.facilityservice;

import org.endipi.assessment.client.common.ClientConfig;
import org.endipi.assessment.dto.external.ClassroomDetailsResponse;
import org.endipi.assessment.dto.external.ClassroomValidationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;
import java.util.Set;

@FeignClient(
        name = "facility-service",  // Service name in Eureka
        path = "/api/v1/classroom", // Base path for the facility service
        configuration = {ClientConfig.class, FacilityServiceClientConfig.class} // Custom configuration for the client
)
public interface FacilityServiceClient {
    @GetMapping("/validate/{classroomId}")
    ClassroomValidationResponse validateClassroom(@PathVariable Long classroomId); // Endpoint to validate a classroom by its ID

    // New batch endpoints for session optimization
    @GetMapping("/s2s/batch-details")
    Map<Long, ClassroomDetailsResponse> getClassroomDetailsByIds(@RequestParam Set<Long> classroomIds);

    @GetMapping("/s2s/all")
    List<ClassroomDetailsResponse> getAllClassroomsWithDetails();
}
