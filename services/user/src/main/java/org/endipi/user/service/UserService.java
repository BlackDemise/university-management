package org.endipi.user.service;

import org.endipi.user.dto.request.UserRequest;
import org.endipi.user.dto.response.StudentValidationResponse;
import org.endipi.user.dto.response.TeacherValidationResponse;
import org.endipi.user.dto.response.UserResponse;
import org.endipi.user.dto.s2s.S2STeacherResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    List<UserResponse> findAll();

    Page<UserResponse> findAll(Pageable pageable);

    Page<UserResponse> findBySearchingCriterion(int page, int size, String sort, String searchValue, String searchCriterion);

    UserResponse findById(Long id);

    UserResponse saveWithRetry(UserRequest userRequest);

    void deleteById(Long id);

    /// Serves S2S communication

    S2STeacherResponse findByTeacherId(Long teacherId);

    List<S2STeacherResponse> findAllTeachers();

    TeacherValidationResponse validateTeacher(Long teacherId);

    StudentValidationResponse validateStudent(Long studentId);
}
