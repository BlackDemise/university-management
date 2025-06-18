package org.endipi.auth.exception;

import lombok.Getter;
import org.endipi.auth.enums.error.ErrorCode;

@Getter
public class ApplicationException extends RuntimeException {
    ErrorCode errorCode;

    public ApplicationException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}