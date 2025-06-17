package org.um.enums.role;

import lombok.Getter;

@Getter
public enum RoleTitle {
    ADMIN("Quản trị viên"),
    TEACHER("Giảng viên"),
    STUDENT("Sinh viên"),
    ADMINISTRATOR_STAFF("Nhân viên hành chính"),
    DORMITORY_STAFF("Nhân viên ký túc xá"),
    LIBRARIAN("Thủ thư"),
    ALUMNI("Cựu sinh viên"),
    APPLICANT("Người nộp đơn vào trường"),
    IT_STAFF("Nhân viên hỗ trợ kỹ thuật"),
    FINANCE_STAFF("Nhân viên tài chính"),
    SECURITY_STAFF("Nhân viên an ninh"),
    RESEARCH_MANAGER("Quản lý nghiên cứu");

    private final String roleTitle;

    RoleTitle(String roleTitle) {
        this.roleTitle = roleTitle;
    }
}