package org.endipi.assessment.client.facilityservice;

import feign.codec.ErrorDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FacilityServiceClientConfig {
    @Bean(name = "facilityServiceErrorDecoder")
    public ErrorDecoder errorDecoder() {
        return new FacilityServiceErrorDecoder();
    }
}
