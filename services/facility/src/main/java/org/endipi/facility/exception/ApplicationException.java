package org.endipi.facility.exception;

import lombok.Getter;
import org.endipi.facility.enums.error.ErrorCode;

@Getter
public class ApplicationException extends RuntimeException {
    ErrorCode errorCode;

    public ApplicationException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}