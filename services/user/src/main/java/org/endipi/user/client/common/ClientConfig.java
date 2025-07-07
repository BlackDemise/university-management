package org.endipi.user.client.common;

import feign.Logger;
import feign.Request;
import feign.RequestInterceptor;
import feign.Retryer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Slf4j
@Configuration
public class ClientConfig {
    // REQUEST INTERCEPTOR - Add JWT token to requests
    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            // Get JWT token from current security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.getCredentials() != null) {
                String token = authentication.getCredentials().toString();
                requestTemplate.header("Authorization", "Bearer " + token);
                log.debug("Added JWT token to Feign request");
            } else {
                log.warn("No JWT token found in security context for Feign request");
            }

            // Add Accept header if not present
            if (!requestTemplate.headers().containsKey("Accept")) {
                requestTemplate.header("Accept", "application/json");
            }

            // Do NOT force Content-Type, only set if not already present
            if (!requestTemplate.headers().containsKey("Content-Type")) {
                requestTemplate.header("Content-Type", "application/json");
            }
        };
    }

    // TIMEOUT CONFIGURATION
    @Bean
    public Request.Options requestOptions() {
        return new Request.Options(
                5000,    // Connect timeout (5 seconds)
                10000,   // Read timeout (10 seconds)
                true     // Follow redirects
        );
    }

    // RETRY CONFIGURATION
    @Bean
    public Retryer retryer() {
        return new Retryer.Default(
                100,     // Initial interval (100ms)
                1000,    // Max interval (1s)
                3        // Max attempts
        );
    }

    // LOGGING CONFIGURATION
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.BASIC; // NONE, BASIC, HEADERS, FULL
    }
}
