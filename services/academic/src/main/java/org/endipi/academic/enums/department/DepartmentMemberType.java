package org.endipi.academic.enums.department;

import lombok.Getter;

@Getter
public enum DepartmentMemberType {
    TEACHER("Giảng viên"),
    FACULTY_HEAD("Trưởng khoa");

    private final String departmentMemberType;

    DepartmentMemberType(String departmentMemberType) {
        this.departmentMemberType = departmentMemberType;
    }
}
