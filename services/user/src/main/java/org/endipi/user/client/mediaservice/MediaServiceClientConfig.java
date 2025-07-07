package org.endipi.user.client.mediaservice;

import feign.codec.Encoder;
import feign.codec.ErrorDecoder;
import feign.form.spring.SpringFormEncoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class MediaServiceClientConfig {
    // ERROR DECODER - Handle HTTP errors gracefully
    @Bean(name = "mediaServiceErrorDecoder")
    public ErrorDecoder errorDecoder() {
        return new MediaServiceErrorDecoder();
    }

    @Bean
    public Encoder feignFormEncoder() {
        return new SpringFormEncoder();
    }
} 