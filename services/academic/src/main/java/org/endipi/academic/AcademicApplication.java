package org.endipi.academic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients(basePackages = "org.endipi.academic.client.userservice")
public class AcademicApplication {

    public static void main(String[] args) {
        SpringApplication.run(AcademicApplication.class, args);
    }

}
