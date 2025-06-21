package org.endipi.enrollment.client.courseservice;

import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class CourseServiceClientConfig {
    // ERROR DECODER - Handle HTTP errors gracefully
    @Bean(name = "courseServiceErrorDecoder")
    public ErrorDecoder errorDecoder() {
        return new CourseServiceErrorDecoder();
    }
}
