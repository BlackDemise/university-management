package org.endipi.user.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.user.dto.excel.*;
import org.endipi.user.enums.role.RoleTitle;
import org.endipi.user.enums.student.StudentStatus;
import org.endipi.user.repository.StudentRepository;
import org.endipi.user.repository.TeacherRepository;
import org.endipi.user.repository.UserRepository;
import org.endipi.user.service.ExcelUserValidationService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExcelUserValidationServiceImpl implements ExcelUserValidationService {
    
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    // Role mapping from display names to enums
    private static final Map<String, RoleTitle> ROLE_MAPPING = Map.ofEntries(
            Map.entry("Quản trị viên", RoleTitle.ADMIN),
            Map.entry("Giảng viên", RoleTitle.TEACHER),
            Map.entry("Sinh viên", RoleTitle.STUDENT),
            Map.entry("Nhân viên hành chính", RoleTitle.ADMINISTRATOR_STAFF),
            Map.entry("Nhân viên ký túc xá", RoleTitle.DORMITORY_STAFF),
            Map.entry("Thủ thư", RoleTitle.LIBRARIAN),
            Map.entry("Cựu sinh viên", RoleTitle.ALUMNI),
            Map.entry("Người nộp đơn vào trường", RoleTitle.APPLICANT),
            Map.entry("Nhân viên hỗ trợ kỹ thuật", RoleTitle.IT_STAFF),
            Map.entry("Nhân viên tài chính", RoleTitle.FINANCE_STAFF),
            Map.entry("Nhân viên an ninh", RoleTitle.SECURITY_STAFF),
            Map.entry("Quản lý nghiên cứu", RoleTitle.RESEARCH_MANAGER)
    );

    // Student status mapping
    private static final Map<String, StudentStatus> STUDENT_STATUS_MAPPING = Map.of(
        "Đang học", StudentStatus.ACTIVE,
        "Đã tốt nghiệp", StudentStatus.GRADUATED,
        "Tạm ngưng", StudentStatus.SUSPENDED
    );
    
    @Override
    public ValidationResult validateExcelUsers(List<ExcelUserRow> rows) {
        List<ValidationError> errors = new ArrayList<>();
        
        // 1. Basic field validation
        validateBasicFields(rows, errors);
        
        // 2. Role-specific validation
        validateRoleSpecificFields(rows, errors);
        
        // 3. Email uniqueness (internal + database)
        validateEmailUniqueness(rows, errors);
        
        // 4. Student/Teacher code uniqueness
        validateCodeUniqueness(rows, errors);
        
        // 5. Date format validation
        validateDateFormats(rows, errors);
        
        List<ExcelUserRow> validRows = filterValidRows(rows, errors);
        
        return ValidationResult.builder()
                .errors(errors)
                .validRows(validRows)
                .totalRows(rows.size())
                .validCount(validRows.size())
                .errorCount(errors.size())
                .build();
    }
    
    @Override
    public EmailValidationResult validateEmails(List<String> emails) {
        // 1. Check for duplicates within Excel file
        Set<String> uniqueEmails = new HashSet<>();
        List<String> duplicatesInExcel = new ArrayList<>();
        
        for (String email : emails) {
            if (email != null && !email.trim().isEmpty()) {
                if (!uniqueEmails.add(email.trim().toLowerCase())) {
                    duplicatesInExcel.add(email);
                }
            }
        }
        
        // 2. Check against database (batch query)
        List<String> cleanEmails = uniqueEmails.stream()
                .filter(email -> email != null && !email.trim().isEmpty())
                .collect(Collectors.toList());
        
        List<String> existingInDb = cleanEmails.isEmpty() ? 
                List.of() : userRepository.findEmailsByEmailIn(cleanEmails);
        
        return EmailValidationResult.builder()
                .duplicatesInExcel(duplicatesInExcel)
                .existingInDatabase(existingInDb)
                .build();
    }
    
    @Override
    public List<String> validateStudentCodes(List<String> studentCodes) {
        List<String> cleanCodes = studentCodes.stream()
                .filter(code -> code != null && !code.trim().isEmpty())
                .map(String::trim)
                .collect(Collectors.toList());
        
        return cleanCodes.isEmpty() ? 
                List.of() : studentRepository.findStudentCodesByStudentCodeIn(cleanCodes);
    }
    
    @Override
    public List<String> validateTeacherCodes(List<String> teacherCodes) {
        List<String> cleanCodes = teacherCodes.stream()
                .filter(code -> code != null && !code.trim().isEmpty())
                .map(String::trim)
                .collect(Collectors.toList());
        
        return cleanCodes.isEmpty() ? 
                List.of() : teacherRepository.findTeacherCodesByTeacherCodeIn(cleanCodes);
    }
    
    private void validateBasicFields(List<ExcelUserRow> rows, List<ValidationError> errors) {
        for (ExcelUserRow row : rows) {
            // Required fields validation
            if (isBlank(row.getFullName())) {
                errors.add(createError(row.getRowNumber(), "fullName", row.getFullName(), 
                        "Họ và tên là bắt buộc", ValidationError.ErrorType.MISSING_REQUIRED));
            }
            
            if (isBlank(row.getEmail())) {
                errors.add(createError(row.getRowNumber(), "email", row.getEmail(), 
                        "Email là bắt buộc", ValidationError.ErrorType.MISSING_REQUIRED));
            } else if (!isValidEmail(row.getEmail())) {
                errors.add(createError(row.getRowNumber(), "email", row.getEmail(), 
                        "Email không hợp lệ", ValidationError.ErrorType.INVALID_FORMAT));
            }
            
            if (isBlank(row.getRole())) {
                errors.add(createError(row.getRowNumber(), "role", row.getRole(), 
                        "Vai trò là bắt buộc", ValidationError.ErrorType.MISSING_REQUIRED));
            } else if (!ROLE_MAPPING.containsKey(row.getRole().trim())) {
                errors.add(createError(row.getRowNumber(), "role", row.getRole(), 
                        "Vai trò không hợp lệ", ValidationError.ErrorType.INVALID_ROLE));
            }
        }
    }
    
    private void validateRoleSpecificFields(List<ExcelUserRow> rows, List<ValidationError> errors) {
        for (ExcelUserRow row : rows) {
            if (isBlank(row.getRole()) || !ROLE_MAPPING.containsKey(row.getRole().trim())) {
                continue; // Skip if role is invalid (already handled in basic validation)
            }
            
            RoleTitle roleTitle = ROLE_MAPPING.get(row.getRole().trim());
            
            if (roleTitle == RoleTitle.STUDENT) {
                validateStudentFields(row, errors);
                validateNoTeacherFields(row, errors);
            } else if (roleTitle == RoleTitle.TEACHER) {
                validateTeacherFields(row, errors);
                validateNoStudentFields(row, errors);
            } else {
                // Other roles should not have student or teacher fields
                validateNoStudentFields(row, errors);
                validateNoTeacherFields(row, errors);
            }
        }
    }
    
    private void validateStudentFields(ExcelUserRow row, List<ValidationError> errors) {
        if (isBlank(row.getStudentCode())) {
            errors.add(createError(row.getRowNumber(), "studentCode", row.getStudentCode(), 
                    "Mã sinh viên là bắt buộc cho vai trò Sinh viên", ValidationError.ErrorType.MISSING_REQUIRED));
        }
        
        if (!isBlank(row.getStudentStatus()) && !STUDENT_STATUS_MAPPING.containsKey(row.getStudentStatus().trim())) {
            errors.add(createError(row.getRowNumber(), "studentStatus", row.getStudentStatus(), 
                    "Trạng thái học tập không hợp lệ", ValidationError.ErrorType.INVALID_STUDENT_STATUS));
        }
    }
    
    private void validateTeacherFields(ExcelUserRow row, List<ValidationError> errors) {
        if (isBlank(row.getTeacherCode())) {
            errors.add(createError(row.getRowNumber(), "teacherCode", row.getTeacherCode(), 
                    "Mã giảng viên là bắt buộc cho vai trò Giảng viên", ValidationError.ErrorType.MISSING_REQUIRED));
        }
    }
    
    private void validateNoStudentFields(ExcelUserRow row, List<ValidationError> errors) {
        if (!isBlank(row.getStudentCode()) || !isBlank(row.getCourseYear()) || !isBlank(row.getStudentStatus())) {
            errors.add(createError(row.getRowNumber(), "studentFields", "", 
                    "Vai trò này không được có thông tin sinh viên", ValidationError.ErrorType.ROLE_FIELD_CONFLICT));
        }
    }
    
    private void validateNoTeacherFields(ExcelUserRow row, List<ValidationError> errors) {
        if (!isBlank(row.getTeacherCode()) || !isBlank(row.getAcademicRank()) || !isBlank(row.getDegree())) {
            errors.add(createError(row.getRowNumber(), "teacherFields", "", 
                    "Vai trò này không được có thông tin giảng viên", ValidationError.ErrorType.ROLE_FIELD_CONFLICT));
        }
    }
    
    private void validateEmailUniqueness(List<ExcelUserRow> rows, List<ValidationError> errors) {
        List<String> emails = rows.stream()
                .map(ExcelUserRow::getEmail)
                .filter(email -> !isBlank(email))
                .collect(Collectors.toList());
        
        EmailValidationResult result = validateEmails(emails);
        
        // Add errors for duplicates in Excel
        result.getDuplicatesInExcel().forEach(email -> {
            errors.add(createError(findRowNumberByEmail(rows, email), "email", email, 
                    "Email bị trùng lặp trong file Excel", ValidationError.ErrorType.DUPLICATE_IN_EXCEL));
        });
        
        // Add errors for existing in database
        result.getExistingInDatabase().forEach(email -> {
            errors.add(createError(findRowNumberByEmail(rows, email), "email", email, 
                    "Email đã tồn tại trong hệ thống", ValidationError.ErrorType.DUPLICATE_IN_DATABASE));
        });
    }
    
    private void validateCodeUniqueness(List<ExcelUserRow> rows, List<ValidationError> errors) {
        // Validate student codes
        List<String> studentCodes = rows.stream()
                .map(ExcelUserRow::getStudentCode)
                .filter(studentCode -> !isBlank(studentCode))
                .collect(Collectors.toList());
        
        List<String> existingStudentCodes = validateStudentCodes(studentCodes);
        existingStudentCodes.forEach(code -> {
            errors.add(createError(findRowNumberByStudentCode(rows, code), "studentCode", code, 
                    "Mã sinh viên đã tồn tại trong hệ thống", ValidationError.ErrorType.DUPLICATE_IN_DATABASE));
        });
        
        // Validate teacher codes
        List<String> teacherCodes = rows.stream()
                .filter(row -> !isBlank(row.getTeacherCode()))
                .map(ExcelUserRow::getTeacherCode)
                .collect(Collectors.toList());
        
        List<String> existingTeacherCodes = validateTeacherCodes(teacherCodes);
        existingTeacherCodes.forEach(code -> {
            errors.add(createError(findRowNumberByTeacherCode(rows, code), "teacherCode", code, 
                    "Mã giảng viên đã tồn tại trong hệ thống", ValidationError.ErrorType.DUPLICATE_IN_DATABASE));
        });
    }
    
    private void validateDateFormats(List<ExcelUserRow> rows, List<ValidationError> errors) {
        for (ExcelUserRow row : rows) {
            if (!isBlank(row.getBirthDate())) {
                try {
                    LocalDate.parse(row.getBirthDate().trim(), DATE_FORMATTER);
                } catch (DateTimeParseException e) {
                    errors.add(createError(row.getRowNumber(), "birthDate", row.getBirthDate(), 
                            "Ngày sinh phải có định dạng yy-MM-dddd", ValidationError.ErrorType.INVALID_DATE_FORMAT));
                }
            }
        }
    }
    
    private List<ExcelUserRow> filterValidRows(List<ExcelUserRow> rows, List<ValidationError> errors) {
        Set<Integer> errorRows = errors.stream()
                .map(ValidationError::getRowNumber)
                .collect(Collectors.toSet());
        
        return rows.stream()
                .filter(row -> !errorRows.contains(row.getRowNumber()))
                .collect(Collectors.toList());
    }
    
    // Helper methods
    private boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }
    
    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }
    
    private ValidationError createError(int rowNumber, String field, String value, String message, ValidationError.ErrorType type) {
        return ValidationError.builder()
                .rowNumber(rowNumber)
                .field(field)
                .value(value)
                .message(message)
                .type(type)
                .build();
    }
    
    private int findRowNumberByEmail(List<ExcelUserRow> rows, String email) {
        return rows.stream()
                .filter(row -> email.equals(row.getEmail()))
                .mapToInt(ExcelUserRow::getRowNumber)
                .findFirst()
                .orElse(0);
    }
    
    private int findRowNumberByStudentCode(List<ExcelUserRow> rows, String code) {
        return rows.stream()
                .filter(row -> code.equals(row.getStudentCode()))
                .mapToInt(ExcelUserRow::getRowNumber)
                .findFirst()
                .orElse(0);
    }
    
    private int findRowNumberByTeacherCode(List<ExcelUserRow> rows, String code) {
        return rows.stream()
                .filter(row -> code.equals(row.getTeacherCode()))
                .mapToInt(ExcelUserRow::getRowNumber)
                .findFirst()
                .orElse(0);
    }
}
