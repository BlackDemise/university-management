package org.endipi.assessment.client.enrollmentservice;

import org.endipi.assessment.client.common.ClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "enrollment-service",
        configuration = {ClientConfig.class, EnrollmentServiceClientConfig.class}
)
public interface EnrollmentServiceClient {
    @GetMapping("/api/v1/course-registration/{courseRegistrationId}/validate")
    boolean validateCourseRegistration(@PathVariable Long courseRegistrationId);

    @GetMapping("/api/v1/course-offering/{courseOfferingId}/validate")
    boolean validateCourseOffering(@PathVariable Long courseOfferingId);
}
