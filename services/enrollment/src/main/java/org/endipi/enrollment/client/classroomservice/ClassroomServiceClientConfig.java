package org.endipi.enrollment.client.classroomservice;

import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class ClassroomServiceClientConfig {
    // ERROR DECODER - Handle HTTP errors gracefully
    @Bean(name = "classroomServiceErrorDecoder")
    public ErrorDecoder errorDecoder() {
        return new ClassroomServiceErrorDecoder();
    }
}
