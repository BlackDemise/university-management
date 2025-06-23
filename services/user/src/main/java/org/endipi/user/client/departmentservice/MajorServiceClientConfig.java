package org.endipi.user.client.departmentservice;

import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class MajorServiceClientConfig {
    // ERROR DECODER - Handle HTTP errors gracefully
    @Bean(name = "majorServiceErrorDecoder")
    public ErrorDecoder errorDecoder() {
        return new MajorServiceErrorDecoder();
    }
}
