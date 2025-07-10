package org.endipi.user.service;

import org.endipi.user.dto.excel.*;
import org.endipi.user.dto.request.UserRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Service for importing users from Excel files
 */
public interface ExcelUserImportService {
    
    /**
     * Parses Excel file and returns list of ExcelUserRow objects
     * @param file Excel file to parse
     * @return List of ExcelUserRow objects
     */
    List<ExcelUserRow> parseExcelFile(MultipartFile file);
    
    /**
     * Validates Excel data and returns validation result
     * @param file Excel file to validate
     * @return ValidationResult containing errors and valid rows
     */
    ValidationResult validateExcelFile(MultipartFile file);
    
    /**
     * Converts ExcelUserRow objects to UserRequest objects
     * @param rows List of validated ExcelUserRow objects
     * @return List of UserRequest objects ready for import
     */
    List<UserRequest> convertToUserRequests(List<ExcelUserRow> rows);
    
    /**
     * Imports users from Excel file with validation
     * @param file Excel file containing user data
     * @return BatchImportResult containing success and failure information
     */
    BatchImportResult importUsersFromExcel(MultipartFile file);
    
    /**
     * Generates a sample Excel template for user import
     * @return byte array containing the Excel template
     */
    byte[] generateSampleTemplate();
}
