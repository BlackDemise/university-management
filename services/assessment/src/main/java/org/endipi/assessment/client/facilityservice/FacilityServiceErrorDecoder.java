package org.endipi.assessment.client.facilityservice;

import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;
import org.endipi.assessment.enums.error.ErrorCode;
import org.endipi.assessment.exception.ApplicationException;

@Slf4j
public class FacilityServiceErrorDecoder implements ErrorDecoder {
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
            case 404 -> new ApplicationException(ErrorCode.FACILITY_NOT_FOUND);
            case 500 -> new ApplicationException(ErrorCode.FACILITY_SERVICE_ERROR);
            case 503 -> new ApplicationException(ErrorCode.FACILITY_SERVICE_UNAVAILABLE);
            default -> new ApplicationException(ErrorCode.GENERIC_ERROR);
        };
    }
}
