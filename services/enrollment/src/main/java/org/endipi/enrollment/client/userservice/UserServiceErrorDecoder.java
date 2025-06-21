package org.endipi.enrollment.client.userservice;

import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;
import org.endipi.enrollment.enums.error.ErrorCode;
import org.endipi.enrollment.exception.ApplicationException;

@Slf4j
public class UserServiceErrorDecoder implements ErrorDecoder {

    @Override
    public Exception decode(String methodKey, Response response) {
        log.error("Feign client error: {} {} - Status: {}",
                response.request().httpMethod(),
                response.request().url(),
                response.status());

        return switch (response.status()) {
            case 400 -> new ApplicationException(ErrorCode.INVALID_REQUEST);
            case 401 -> new ApplicationException(ErrorCode.USER_NOT_AUTHENTICATED);
            case 403 -> new ApplicationException(ErrorCode.USER_NOT_AUTHORIZED);
            case 404 -> new ApplicationException(ErrorCode.TEACHER_NOT_FOUND);
            case 503 -> new ApplicationException(ErrorCode.USER_SERVICE_UNAVAILABLE);
            default -> new ApplicationException(ErrorCode.GENERIC_ERROR);
        };
    }
}