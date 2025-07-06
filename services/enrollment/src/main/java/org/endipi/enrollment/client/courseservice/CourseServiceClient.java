package org.endipi.enrollment.client.courseservice;

import org.endipi.enrollment.client.common.ClientConfig;
import org.endipi.enrollment.dto.external.CourseBasicInfo;
import org.endipi.enrollment.dto.external.CourseResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;
import java.util.Set;

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

    @GetMapping("/s2s/id-name")
    Map<Long, String> getCourseNamesByIds(@RequestParam Set<Long> ids);

    @GetMapping("/s2s/id-basic-info")
    Map<Long, CourseBasicInfo> getCourseBasicInfoByIds(@RequestParam Set<Long> ids);
}
