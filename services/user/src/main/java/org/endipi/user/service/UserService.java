package org.endipi.user.service;

import org.endipi.user.dto.request.UserRequest;
import org.endipi.user.dto.response.StudentValidationResponse;
import org.endipi.user.dto.response.TeacherValidationResponse;
import org.endipi.user.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    List<UserResponse> findAll();

    Page<UserResponse> findAll(Pageable pageable);

    UserResponse findById(Long id);

    UserResponse saveWithRetry(UserRequest userRequest);

    void deleteById(Long id);

    TeacherValidationResponse validateTeacher(Long teacherId);

    StudentValidationResponse validateStudent(Long studentId);
}
