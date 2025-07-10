package org.endipi.user.dto.excel;

import lombok.*;
import org.endipi.user.dto.response.UserResponse;

import java.util.List;

/**
 * Represents the result of batch user import
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchImportResult {
    private List<UserResponse> successfulUsers;
    private List<ImportError> failedUsers;
    private int totalProcessed;
    private int successCount;
    private int failureCount;
    
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImportError {
        private int rowNumber;
        private String email;
        private String fullName;
        private String errorMessage;
    }
    
    public static BatchImportResult allSuccess(List<UserResponse> users) {
        return BatchImportResult.builder()
                .successfulUsers(users)
                .failedUsers(List.of())
                .totalProcessed(users.size())
                .successCount(users.size())
                .failureCount(0)
                .build();
    }
    
    public static BatchImportResult allFailed(List<ValidationError> errors) {
        return BatchImportResult.builder()
                .successfulUsers(List.of())
                .failedUsers(List.of())
                .totalProcessed(0)
                .successCount(0)
                .failureCount(errors.size())
                .build();
    }
}
