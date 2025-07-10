package org.endipi.user.dto.excel;

import lombok.*;

/**
 * Represents a validation error for Excel import
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationError {
    private int rowNumber;
    private String field;
    private String value;
    private String message;
    private ErrorType type;
    
    public enum ErrorType {
        DUPLICATE_IN_EXCEL,
        DUPLICATE_IN_DATABASE,
        INVALID_FORMAT,
        MISSING_REQUIRED,
        INVALID_ROLE,
        INVALID_STUDENT_STATUS,
        ROLE_FIELD_CONFLICT,
        INVALID_DATE_FORMAT
    }
}
