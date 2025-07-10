package org.endipi.user.service;

import org.endipi.user.dto.excel.*;

import java.util.List;

/**
 * Service for validating Excel user import data
 */
public interface ExcelUserValidationService {
    
    /**
     * Validates a list of Excel user rows
     * @param rows List of Excel user rows to validate
     * @return ValidationResult containing errors and valid rows
     */
    ValidationResult validateExcelUsers(List<ExcelUserRow> rows);
    
    /**
     * Validates email uniqueness within Excel file and against database
     * @param emails List of emails to validate
     * @return EmailValidationResult containing duplicates information
     */
    EmailValidationResult validateEmails(List<String> emails);
    
    /**
     * Validates student codes uniqueness
     * @param studentCodes List of student codes to validate
     * @return List of existing student codes
     */
    List<String> validateStudentCodes(List<String> studentCodes);
    
    /**
     * Validates teacher codes uniqueness
     * @param teacherCodes List of teacher codes to validate
     * @return List of existing teacher codes
     */
    List<String> validateTeacherCodes(List<String> teacherCodes);
}
