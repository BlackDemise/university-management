package org.endipi.user.exception;

import lombok.Getter;
import org.endipi.user.enums.error.ErrorCode;

@Getter
public class ApplicationException extends RuntimeException {
    ErrorCode errorCode;

    public ApplicationException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}