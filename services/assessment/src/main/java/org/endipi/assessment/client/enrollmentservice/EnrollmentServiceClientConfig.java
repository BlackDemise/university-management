package org.endipi.assessment.client.enrollmentservice;

import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class EnrollmentServiceClientConfig {
    // ERROR DECODER - Handle HTTP errors gracefully
    @Bean(name = "enrollmentServiceErrorDecoder")
    public ErrorDecoder errorDecoder() {
        return new EnrollmentServiceErrorDecoder();
    }
}