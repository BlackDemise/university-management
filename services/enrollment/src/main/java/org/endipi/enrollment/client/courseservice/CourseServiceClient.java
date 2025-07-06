package org.endipi.enrollment.client.courseservice;

import org.endipi.enrollment.client.common.ClientConfig;
import org.endipi.enrollment.dto.external.CourseResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(
        name = "academic-service",
        path = "/api/v1/course",
        configuration = {ClientConfig.class, CourseServiceClientConfig.class}
)
public interface CourseServiceClient {
    @GetMapping("/validate/{courseId}")
    boolean validateCourse(@PathVariable Long courseId);

    @GetMapping("/s2s/details/{courseId}")
    CourseResponse getCourseDetails(@PathVariable Long courseId);

    @GetMapping("/s2s/all")
    List<CourseResponse> getAllCourses();
}
