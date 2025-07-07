package org.endipi.assessment.client.academicservice;

import feign.Logger;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class AcademicServiceClientConfig {
    @Bean
    Logger.Level academicServiceFeignLoggerLevel() {
        return Logger.Level.BASIC;
    }
}
