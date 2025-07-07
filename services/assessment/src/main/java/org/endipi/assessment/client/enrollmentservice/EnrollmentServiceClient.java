package org.endipi.assessment.client.enrollmentservice;

import org.endipi.assessment.client.common.ClientConfig;
import org.endipi.assessment.dto.external.CourseOfferingDetailsResponse;
import org.endipi.assessment.dto.external.CourseRegistrationDetailsResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;
import java.util.Set;

@FeignClient(
        name = "enrollment-service",
        configuration = {ClientConfig.class, EnrollmentServiceClientConfig.class}
)
public interface EnrollmentServiceClient {
    @GetMapping("/api/v1/course-registration/{courseRegistrationId}/validate")
    boolean validateCourseRegistration(@PathVariable Long courseRegistrationId);

    @GetMapping("/api/v1/course-offering/{courseOfferingId}/validate")
    boolean validateCourseOffering(@PathVariable Long courseOfferingId);

    @GetMapping("/api/v1/course-registration/s2s/batch-details")
    Map<Long, CourseRegistrationDetailsResponse> getCourseRegistrationDetailsByIds(@RequestParam Set<Long> courseRegistrationIds);

    @GetMapping("/api/v1/course-registration/s2s/student/{studentId}")
    List<CourseRegistrationDetailsResponse> getCourseRegistrationsByStudentId(@PathVariable Long studentId);

    // New batch endpoints for session optimization
    @GetMapping("/api/v1/course-offering/s2s/batch-details")
    Map<Long, CourseOfferingDetailsResponse> getCourseOfferingDetailsByIds(@RequestParam Set<Long> courseOfferingIds);

    @GetMapping("/api/v1/course-offering/s2s/all")
    List<CourseOfferingDetailsResponse> getAllCourseOfferingsWithDetails();
}
