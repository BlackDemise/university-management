package org.endipi.user.dto.excel;

import lombok.*;

/**
 * Represents a single row from the Excel file for user import
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExcelUserRow {
    private int rowNumber;
    
    // Core user information
    private String fullName;
    private String identityNumber;
    private String email;
    private String permanentAddress;
    private String phone;
    private String currentAddress;
    private String birthDate;
    private String role;
    
    // Student specific information
    private String studentCode;
    private String courseYear;
    private String studentStatus;
    private String majorName;
    
    // Teacher specific information
    private String teacherCode;
    private String academicRank;
    private String degree;
}
