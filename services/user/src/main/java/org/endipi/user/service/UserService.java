package org.endipi.user.service;

import org.endipi.user.dto.request.UserRequest;
import org.endipi.user.dto.response.StudentValidationResponse;
import org.endipi.user.dto.response.TeacherValidationResponse;
import org.endipi.user.dto.response.UserResponse;
import org.endipi.user.dto.s2s.S2SStudentResponse;
import org.endipi.user.dto.s2s.S2STeacherResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface UserService {
    List<UserResponse> findAll();

    Page<UserResponse> findAll(Pageable pageable);

    Page<UserResponse> findBySearchingCriterion(int page, int size, String sort, String searchValue, String searchCriterion);

    UserResponse findById(Long id);

    UserResponse saveWithRetry(UserRequest userRequest);

    void deleteById(Long id);

    // Avatar upload functionality
    UserResponse uploadAvatar(Long userId, MultipartFile file);

    // This helps enrollment-service to retrieve teacherName by id via a batch instead of one by one
    Map<Long, String> getTeacherNamesByIds(Set<Long> ids); // Map<teacherId, teacherName>

    /// Serves S2S communication

    S2STeacherResponse findByTeacherId(Long teacherId);

    List<S2STeacherResponse> findAllTeachers();

    TeacherValidationResponse validateTeacher(Long teacherId);

    StudentValidationResponse validateStudent(Long studentId);

    // Student S2S methods
    List<S2SStudentResponse> findAllStudents();

    S2SStudentResponse findByStudentId(Long studentId);

    Map<Long, String> getStudentNamesByIds(Set<Long> ids); // Map<studentId, studentName>

    // New batch method for cross-service optimization
    Map<Long, TeacherValidationResponse> getTeacherDetailsByIds(Set<Long> teacherIds);
}
