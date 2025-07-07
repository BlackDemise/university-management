package org.endipi.user.client.mediaservice;

import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;
import org.endipi.user.enums.error.ErrorCode;
import org.endipi.user.exception.ApplicationException;

@Slf4j
public class MediaServiceErrorDecoder implements ErrorDecoder {
    @Override
    public Exception decode(String methodKey, Response response) {
        log.error("Media service client error: {} {} - Status: {}",
                response.request().httpMethod(),
                response.request().url(),
                response.status());

        return switch (response.status()) {
            case 400 -> new ApplicationException(ErrorCode.INVALID_REQUEST);
            case 401 -> new ApplicationException(ErrorCode.USER_NOT_AUTHENTICATED);
            case 403 -> new ApplicationException(ErrorCode.USER_NOT_AUTHORIZED);
            case 404 -> new ApplicationException(ErrorCode.RESOURCE_NOT_FOUND);
            case 413 -> new ApplicationException(ErrorCode.FILE_TOO_LARGE);
            case 503 -> new ApplicationException(ErrorCode.MEDIA_SERVICE_UNAVAILABLE);
            default -> new ApplicationException(ErrorCode.GENERIC_ERROR);
        };
    }
} 