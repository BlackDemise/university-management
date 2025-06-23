package org.endipi.assessment.client.userservice;

import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class UserServiceClientConfig {
    // ERROR DECODER - Handle HTTP errors gracefully
    @Bean(name = "userServiceErrorDecoder")
    public ErrorDecoder errorDecoder() {
        return new UserServiceErrorDecoder();
    }
}