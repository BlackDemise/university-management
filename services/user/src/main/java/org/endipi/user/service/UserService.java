package org.endipi.user.service;

import org.endipi.user.dto.request.UserRequest;
import org.endipi.user.dto.response.StudentValidationResponse;
import org.endipi.user.dto.response.TeacherValidationResponse;
import org.endipi.user.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> findAll();

    UserResponse findById(Long id);

    UserResponse saveWithRetry(UserRequest userRequest);

    void deleteById(Long id);

    TeacherValidationResponse validateTeacher(Long teacherId);

    StudentValidationResponse validateStudent(Long studentId);
}
