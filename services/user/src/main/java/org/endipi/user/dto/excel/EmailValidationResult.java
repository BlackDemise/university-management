package org.endipi.user.dto.excel;

import lombok.*;

import java.util.List;

/**
 * Represents the result of email validation for Excel import
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailValidationResult {
    private List<String> duplicatesInExcel;
    private List<String> existingInDatabase;
    
    public boolean hasDuplicates() {
        return (duplicatesInExcel != null && !duplicatesInExcel.isEmpty()) ||
               (existingInDatabase != null && !existingInDatabase.isEmpty());
    }
}
