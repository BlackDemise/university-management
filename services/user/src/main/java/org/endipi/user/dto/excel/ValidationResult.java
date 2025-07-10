package org.endipi.user.dto.excel;

import lombok.*;

import java.util.List;

/**
 * Represents the result of Excel validation
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationResult {
    private List<ValidationError> errors;
    private List<ExcelUserRow> validRows;
    private int totalRows;
    private int validCount;
    private int errorCount;
    
    public boolean hasErrors() {
        return errors != null && !errors.isEmpty();
    }
    
    public boolean isValid() {
        return !hasErrors();
    }
}
