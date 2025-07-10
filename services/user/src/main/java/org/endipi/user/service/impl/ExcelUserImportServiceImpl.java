package org.endipi.user.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.endipi.user.dto.excel.*;
import org.endipi.user.dto.request.StudentRequest;
import org.endipi.user.dto.request.TeacherRequest;
import org.endipi.user.dto.request.UserRequest;
import org.endipi.user.dto.response.UserResponse;
import org.endipi.user.enums.error.ErrorCode;
import org.endipi.user.enums.role.RoleTitle;
import org.endipi.user.enums.student.StudentStatus;
import org.endipi.user.exception.ApplicationException;
import org.endipi.user.service.ExcelUserImportService;
import org.endipi.user.service.ExcelUserValidationService;
import org.endipi.user.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExcelUserImportServiceImpl implements ExcelUserImportService {

    private final ExcelUserValidationService validationService;
    private final UserService userService;

    // Column mapping for Excel file
    private static final Map<Integer, String> COLUMN_MAPPING = Map.ofEntries(
            Map.entry(0, "fullName"),
            Map.entry(1, "identityNumber"),
            Map.entry(2, "email"),
            Map.entry(3, "permanentAddress"),
            Map.entry(4, "phone"),
            Map.entry(5, "currentAddress"),
            Map.entry(6, "birthDate"),
            Map.entry(7, "role"),
            Map.entry(8, "studentCode"),
            Map.entry(9, "courseYear"),
            Map.entry(10, "studentStatus"),
            Map.entry(11, "majorName"),
            Map.entry(12, "teacherCode"),
            Map.entry(13, "academicRank"),
            Map.entry(14, "degree")
    );

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
    public List<ExcelUserRow> parseExcelFile(MultipartFile file) {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            List<ExcelUserRow> rows = new ArrayList<>();

            // Skip header row (row 0)
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null || isEmptyRow(row)) {
                    continue;
                }

                ExcelUserRow userRow = parseRow(row, i + 1); // +1 for 1-based row numbering
                rows.add(userRow);
            }

            return rows;
        } catch (IOException e) {
            log.error("Error parsing Excel file: {}", e.getMessage(), e);
            throw new ApplicationException(ErrorCode.GENERIC_ERROR);
        }
    }

    @Override
    public ValidationResult validateExcelFile(MultipartFile file) {
        List<ExcelUserRow> rows = parseExcelFile(file);
        return validationService.validateExcelUsers(rows);
    }

    @Override
    public List<UserRequest> convertToUserRequests(List<ExcelUserRow> rows) {
        return rows.stream()
                .map(this::convertToUserRequest)
                .collect(Collectors.toList());
    }

    @Override
    public BatchImportResult importUsersFromExcel(MultipartFile file) {
        // 1. Validate Excel file
        ValidationResult validationResult = validateExcelFile(file);

        if (validationResult.hasErrors()) {
            log.warn("Excel validation failed with {} errors", validationResult.getErrorCount());
            return BatchImportResult.allFailed(validationResult.getErrors());
        }

        // 2. Convert to UserRequest objects
        List<UserRequest> userRequests = convertToUserRequests(validationResult.getValidRows());

        // 3. Try batch save first (hybrid approach)
        try {
            List<UserResponse> savedUsers = saveUsersBatch(userRequests);
            log.info("Successfully imported {} users via batch save", savedUsers.size());
            return BatchImportResult.allSuccess(savedUsers);
        } catch (Exception e) {
            log.warn("Batch save failed, falling back to individual saves: {}", e.getMessage());
            return saveUsersIndividually(userRequests, validationResult.getValidRows());
        }
    }

    @Override
    public byte[] generateSampleTemplate() {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("User Import Template");

            // Create header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {
                    "Họ và tên", "CCCD/CMND", "Email", "Địa chỉ thường trú", "SĐT",
                    "Địa chỉ hiện tại", "Ngày sinh", "Vai trò", "Mã sinh viên",
                    "Khoá học", "Trạng thái học tập", "Chuyên ngành", "Mã giảng viên",
                    "Học Hàm", "Học Vị"
            };

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            // Create sample data row
            Row sampleRow = sheet.createRow(1);
            String[] sampleData = {
                    "Nguyễn Văn A", "123456789012", "a@gmail.com", "123 Đường ABC, Quận 1, TP.HCM",
                    "0123456789", "456 Đường XYZ, Quận 2, TP.HCM", "20-10-1980", "Sinh viên",
                    "SV123456", "2024", "Đang học", "Kỹ thuật phần mềm", "", "", ""
            };

            for (int i = 0; i < sampleData.length; i++) {
                Cell cell = sampleRow.createCell(i);
                cell.setCellValue(sampleData[i]);
            }

            // Add data validation for 'Vai trò' (column 7)
            String[] roleTitleList = Arrays.stream(RoleTitle.values())
                    .map(RoleTitle::getRoleTitle)
                    .toArray(String[]::new);
            DataValidationHelper dvHelper = sheet.getDataValidationHelper();
            DataValidationConstraint vaiTroConstraint = dvHelper.createExplicitListConstraint(roleTitleList);
            CellRangeAddressList vaiTroAddressList = new CellRangeAddressList(1, 1000, 7, 7);
            DataValidation vaiTroValidation = dvHelper.createValidation(vaiTroConstraint, vaiTroAddressList);
            vaiTroValidation.setSuppressDropDownArrow(false);
            sheet.addValidationData(vaiTroValidation);

            // Add data validation for 'Trạng thái học tập' (column 10)
            String[] studentStatusList = Arrays.stream(StudentStatus.values())
                    .map(StudentStatus::getStudentStatus)
                    .toArray(String[]::new);
            DataValidationConstraint trangThaiConstraint = dvHelper.createExplicitListConstraint(studentStatusList);
            CellRangeAddressList trangThaiAddressList = new CellRangeAddressList(1, 1000, 10, 10);
            DataValidation trangThaiValidation = dvHelper.createValidation(trangThaiConstraint, trangThaiAddressList);
            trangThaiValidation.setSuppressDropDownArrow(false);
            sheet.addValidationData(trangThaiValidation);

            // Add data validation for 'Chuyên ngành' (column 11)
            String[] chuyenNganhList = {"Kỹ thuật phần mềm", "Khoa học máy tính", "Hệ thống thông tin"};
            DataValidationConstraint chuyenNganhConstraint = dvHelper.createExplicitListConstraint(chuyenNganhList);
            CellRangeAddressList chuyenNganhAddressList = new CellRangeAddressList(1, 1000, 11, 11);
            DataValidation chuyenNganhValidation = dvHelper.createValidation(chuyenNganhConstraint, chuyenNganhAddressList);
            chuyenNganhValidation.setSuppressDropDownArrow(false);
            sheet.addValidationData(chuyenNganhValidation);

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        } catch (IOException e) {
            log.error("Error generating sample template: {}", e.getMessage(), e);
            throw new ApplicationException(ErrorCode.GENERIC_ERROR);
        }
    }

    private ExcelUserRow parseRow(Row row, int rowNumber) {
        return ExcelUserRow.builder()
                .rowNumber(rowNumber)
                .fullName(getCellValueAsString(row.getCell(0)))
                .identityNumber(getCellValueAsString(row.getCell(1)))
                .email(getCellValueAsString(row.getCell(2)))
                .permanentAddress(getCellValueAsString(row.getCell(3)))
                .phone(getCellValueAsString(row.getCell(4)))
                .currentAddress(getCellValueAsString(row.getCell(5)))
                .birthDate(getCellValueAsString(row.getCell(6)))
                .role(getCellValueAsString(row.getCell(7)))
                .studentCode(getCellValueAsString(row.getCell(8)))
                .courseYear(getCellValueAsString(row.getCell(9)))
                .studentStatus(getCellValueAsString(row.getCell(10)))
                .majorName(getCellValueAsString(row.getCell(11)))
                .teacherCode(getCellValueAsString(row.getCell(12)))
                .academicRank(getCellValueAsString(row.getCell(13)))
                .degree(getCellValueAsString(row.getCell(14)))
                .build();
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return null;
        }

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toLocalDate().toString();
                } else {
                    return String.valueOf((long) cell.getNumericCellValue());
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return null;
        }
    }

    private boolean isEmptyRow(Row row) {
        for (int i = 0; i < 14; i++) { // Check first 14 columns
            Cell cell = row.getCell(i);
            if (cell != null && cell.getCellType() != CellType.BLANK) {
                String value = getCellValueAsString(cell);
                if (value != null && !value.trim().isEmpty()) {
                    return false;
                }
            }
        }
        return true;
    }

    private UserRequest convertToUserRequest(ExcelUserRow row) {
        UserRequest.UserRequestBuilder builder = UserRequest.builder()
                .fullName(row.getFullName())
                .email(row.getEmail())
                .phone(row.getPhone())
                .identityNumber(row.getIdentityNumber())
                .permanentAddress(row.getPermanentAddress())
                .currentAddress(row.getCurrentAddress())
                .birthDate(row.getBirthDate())
                .role(ROLE_MAPPING.get(row.getRole()).name());

        // Add role-specific data
        RoleTitle roleTitle = ROLE_MAPPING.get(row.getRole());
        if (roleTitle == RoleTitle.STUDENT) {
            StudentRequest studentRequest = StudentRequest.builder()
                    .studentCode(row.getStudentCode())
                    .courseYear(parseInteger(row.getCourseYear()))
                    .studentStatus(STUDENT_STATUS_MAPPING.get(row.getStudentStatus()).name())
                    .build();
            builder.studentRequest(studentRequest);
        } else if (roleTitle == RoleTitle.TEACHER) {
            TeacherRequest teacherRequest = TeacherRequest.builder()
                    .teacherCode(row.getTeacherCode())
                    .academicRank(row.getAcademicRank())
                    .degree(row.getDegree())
                    .build();
            builder.teacherRequest(teacherRequest);
        }

        return builder.build();
    }

    private Integer parseInteger(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private List<UserResponse> saveUsersBatch(List<UserRequest> userRequests) {
        // This would ideally use a batch save method, but for now we'll use individual saves
        // In a real implementation, you might want to add a batch save method to UserService
        List<UserResponse> results = new ArrayList<>();
        for (UserRequest request : userRequests) {
            UserResponse saved = userService.saveWithRetry(request);
            results.add(saved);
        }
        return results;
    }

    private BatchImportResult saveUsersIndividually(List<UserRequest> userRequests, List<ExcelUserRow> originalRows) {
        List<UserResponse> successfulUsers = new ArrayList<>();
        List<BatchImportResult.ImportError> failedUsers = new ArrayList<>();

        for (int i = 0; i < userRequests.size(); i++) {
            UserRequest request = userRequests.get(i);
            ExcelUserRow originalRow = originalRows.get(i);

            try {
                UserResponse saved = userService.saveWithRetry(request);
                successfulUsers.add(saved);
            } catch (Exception e) {
                log.error("Failed to save user from row {}: {}", originalRow.getRowNumber(), e.getMessage());
                failedUsers.add(BatchImportResult.ImportError.builder()
                        .rowNumber(originalRow.getRowNumber())
                        .email(originalRow.getEmail())
                        .fullName(originalRow.getFullName())
                        .errorMessage(e.getMessage())
                        .build());
            }
        }

        return BatchImportResult.builder()
                .successfulUsers(successfulUsers)
                .failedUsers(failedUsers)
                .totalProcessed(userRequests.size())
                .successCount(successfulUsers.size())
                .failureCount(failedUsers.size())
                .build();
    }
}
