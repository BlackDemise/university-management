package org.endipi.enrollment.exception;

import lombok.Getter;

import java.util.Map;

/**
 * Custom validation exception for field-specific validation errors
 */
@Getter
public class ValidationException extends RuntimeException {
    private final Map<String, String> fieldErrors;

    public ValidationException(Map<String, String> fieldErrors) {
        super("Validation failed");
        this.fieldErrors = fieldErrors;
    }

    public ValidationException(String field, String message) {
        this(Map.of(field, message));
    }
}
