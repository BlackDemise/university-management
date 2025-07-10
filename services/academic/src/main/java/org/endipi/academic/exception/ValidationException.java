package org.endipi.academic.exception;

import lombok.Getter;

/**
 * Custom validation exception for field-specific validation errors
 */
@Getter
public class ValidationException extends RuntimeException {
    private final java.util.Map<String, String> fieldErrors;

    public ValidationException(java.util.Map<String, String> fieldErrors) {
        super("Validation failed");
        this.fieldErrors = fieldErrors;
    }

    public ValidationException(String field, String message) {
        this(java.util.Map.of(field, message));
    }
}
