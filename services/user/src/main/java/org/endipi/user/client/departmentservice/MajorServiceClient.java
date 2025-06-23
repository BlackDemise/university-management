package org.endipi.user.client.departmentservice;

import org.endipi.user.client.common.ClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "academic-service",
        path = "/api/v1/major",
        configuration = {ClientConfig.class, MajorServiceClientConfig.class}
)
public interface MajorServiceClient {
    @GetMapping("/validate/{majorId}")
    boolean validateMajor(@PathVariable Long majorId);
}
