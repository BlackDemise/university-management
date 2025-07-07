package org.endipi.user.client.mediaservice;

import org.endipi.user.client.common.ClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(
        name = "media-service",
        path = "/api/v1/gcs",
        configuration = {ClientConfig.class, MediaServiceClientConfig.class}
)
public interface MediaServiceClient {
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    String uploadFile(@RequestPart("file") MultipartFile file);
} 