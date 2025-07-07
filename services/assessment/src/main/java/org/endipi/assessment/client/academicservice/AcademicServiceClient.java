package org.endipi.assessment.client.academicservice;

import org.endipi.assessment.client.common.ClientConfig;
import org.endipi.assessment.dto.external.CourseBasicInfo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;
import java.util.Set;

@FeignClient(
        name = "academic-service",
        configuration = {ClientConfig.class, AcademicServiceClientConfig.class}
)
public interface AcademicServiceClient {
    
    @GetMapping("/api/v1/course/s2s/basic-info")
    Map<Long, CourseBasicInfo> getCourseBasicInfoByIds(@RequestParam Set<Long> ids);
}
