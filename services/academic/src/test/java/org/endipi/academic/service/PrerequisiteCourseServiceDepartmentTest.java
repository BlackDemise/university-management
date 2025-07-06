package org.endipi.academic.service;

import org.endipi.academic.entity.Course;
import org.endipi.academic.repository.CourseRepository;
import org.endipi.academic.service.impl.PrerequisiteCourseServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

/**
 * Test class for department lookup functionality in PrerequisiteCourseService
 * Tests various scenarios:
 * 1. Course with no department (not in any program curriculum)
 * 2. Course with single department
 * 3. Course with multiple departments (interdisciplinary courses)
 */
@ExtendWith(MockitoExtension.class)
public class PrerequisiteCourseServiceDepartmentTest {

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private PrerequisiteCourseServiceImpl prerequisiteCourseService;

    @Test
    void testGetDepartmentNameFromCourse_NoDepartment() throws Exception {
        // Given: A course with no department assignments
        Course course = Course.builder().id(1L).code("CS999").name("Test Course").build();
        when(courseRepository.findDepartmentNamesByCourseId(1L)).thenReturn(Collections.emptyList());

        // When: Getting department name
        String result = callGetDepartmentNameFromCourse(course);

        // Then: Should return Vietnamese localized "Unknown Department"
        assertEquals("Khoa không xác định", result);
    }

    @Test
    void testGetDepartmentNameFromCourse_SingleDepartment() throws Exception {
        // Given: A course assigned to Computer Science department only
        Course course = Course.builder().id(2L).code("CS101").name("Intro to Programming").build();
        when(courseRepository.findDepartmentNamesByCourseId(2L))
                .thenReturn(Collections.singletonList("Computer Science"));

        // When: Getting department name
        String result = callGetDepartmentNameFromCourse(course);

        // Then: Should return the single department name
        assertEquals("Computer Science", result);
    }

    @Test
    void testGetDepartmentNameFromCourse_MultipleDepartments() throws Exception {
        // Given: An interdisciplinary course assigned to multiple departments
        Course course = Course.builder().id(3L).code("MATH301").name("Applied Statistics").build();
        when(courseRepository.findDepartmentNamesByCourseId(3L))
                .thenReturn(Arrays.asList("Mathematics", "Computer Science", "Business"));

        // When: Getting department name
        String result = callGetDepartmentNameFromCourse(course);

        // Then: Should return departments joined by " | "
        assertEquals("Mathematics | Computer Science | Business", result);
    }

    /**
     * Helper method to call the private getDepartmentNameFromCourse method using reflection
     */
    private String callGetDepartmentNameFromCourse(Course course) throws Exception {
        Method method = PrerequisiteCourseServiceImpl.class.getDeclaredMethod("getDepartmentNameFromCourse", Course.class);
        method.setAccessible(true);
        return (String) method.invoke(prerequisiteCourseService, course);
    }
} 