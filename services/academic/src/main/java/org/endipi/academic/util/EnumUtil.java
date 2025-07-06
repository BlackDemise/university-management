package org.endipi.academic.util;

import org.endipi.academic.enums.course.CourseType;
import org.endipi.academic.enums.department.DepartmentMemberType;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class EnumUtil {
    public Map<String, String> getCourseTypes() {
        Map<String, String> courseTypes = new HashMap<>();

        for (CourseType type : CourseType.values()) {
            courseTypes.put(type.name(), type.getCourseType());
        }

        return courseTypes;
    }

    public Map<String, String> getDepartmentMemberTypes() {
        Map<String, String> departmentMemberTypes = new HashMap<>();

        for (DepartmentMemberType dmt : DepartmentMemberType.values()) {
            departmentMemberTypes.put(dmt.name(), dmt.getDepartmentMemberType());
        }

        return departmentMemberTypes;
    }
}
