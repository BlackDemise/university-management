package org.endipi.user.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.user.dto.request.StudentRequest;
import org.endipi.user.dto.request.TeacherRequest;
import org.endipi.user.dto.request.UserRequest;
import org.endipi.user.dto.response.StudentValidationResponse;
import org.endipi.user.dto.response.TeacherValidationResponse;
import org.endipi.user.dto.response.UserResponse;
import org.endipi.user.entity.Student;
import org.endipi.user.entity.Teacher;
import org.endipi.user.entity.User;
import org.endipi.user.enums.error.ErrorCode;
import org.endipi.user.exception.ApplicationException;
import org.endipi.user.mapper.StudentMapper;
import org.endipi.user.mapper.TeacherMapper;
import org.endipi.user.mapper.UserMapper;
import org.endipi.user.producer.TeacherEventProducer;
import org.endipi.user.producer.UserEventProducer;
import org.endipi.user.repository.RoleRepository;
import org.endipi.user.repository.StudentRepository;
import org.endipi.user.repository.TeacherRepository;
import org.endipi.user.repository.UserRepository;
import org.endipi.user.service.EmailService;
import org.endipi.user.service.UserService;
import org.endipi.user.util.PasswordUtil;
import org.hibernate.StaleObjectStateException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;
    private final PasswordUtil passwordUtil;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final UserEventProducer userEventProducer;
    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;
    private final TeacherRepository teacherRepository;
    private final TeacherMapper teacherMapper;
    private final TeacherEventProducer teacherEventProducer;

    @Value("${retry.user.attempts}")
    private long retryAttempts;

    @Override
    public List<UserResponse> findAll() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    @Override
    public UserResponse findById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toResponse)
                .orElseThrow(() -> new ApplicationException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public UserResponse saveWithRetry(UserRequest userRequest) {
        for (long attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                log.info("Attempt {} to save user with ID: {}", attempt, userRequest.getId());
                return save(userRequest);
            } catch (ObjectOptimisticLockingFailureException | StaleObjectStateException e) {
                log.warn("Optimistic lock failure on attempt {} for userId {}: {}", attempt, userRequest.getId(), e.getMessage());
                if (attempt == retryAttempts) throw e;
            }
        }

        throw new ApplicationException(ErrorCode.GENERIC_ERROR);
    }

    @Override
    public void deleteById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.USER_NOT_FOUND));

        // Check if user was a teacher before deletion
        boolean wasTeacher = user.getRole() != null &&
                "TEACHER".equals(user.getRole().getRoleTitle().name());

        userRepository.deleteById(id);

        // Publish event to auth service
        userEventProducer.publishUserDeleted(user);

        // If a teacher...
        if (wasTeacher) {
            // ... publish event to academic service
            teacherEventProducer.publishTeacherRemoved(user);
        }
    }

    @Override
    public TeacherValidationResponse validateTeacher(Long teacherId) {
        Optional<User> userOpt = userRepository.findById(teacherId);

        if (userOpt.isEmpty()) {
            return TeacherValidationResponse.builder()
                    .exists(false)
                    .isTeacher(false)
                    .build();
        }

        User user = userOpt.get();
        boolean isTeacher = user.getRole() != null &&
                "TEACHER".equals(user.getRole().getRoleTitle().name());

        return TeacherValidationResponse.builder()
                .exists(true)
                .isTeacher(isTeacher)
                .fullName(user.getFullName())
                .teacherCode(user.getTeacher() != null ? user.getTeacher().getTeacherCode() : null)
                .build();
    }

    @Override
    public StudentValidationResponse validateStudent(Long studentId) {
        Optional<User> userOpt = userRepository.findById(studentId);

        if (userOpt.isEmpty()) {
            return StudentValidationResponse.builder()
                    .exists(false)
                    .isStudent(false)
                    .build();
        }

        User user = userOpt.get();
        boolean isStudent = user.getRole() != null &&
                "STUDENT".equals(user.getRole().getRoleTitle().name());

        return StudentValidationResponse.builder()
                .exists(true)
                .isStudent(isStudent)
                .fullName(user.getFullName())
                .studentCode(user.getStudent() != null ? user.getStudent().getStudentCode() : null)
                .email(user.getEmail())
                .build();
    }

    private UserResponse save(UserRequest userRequest) {
        User user;
        boolean isUpdated = userRequest.getId() != null;

        // Use this field to handle the case where user's role is changed away from TEACHER.
        // At that point, an event must be fired to academic service to remove the teacher.
        boolean wasTeacher = false;

        if (isUpdated) {
            user = userRepository.findById(userRequest.getId())
                    .orElseThrow(() -> new ApplicationException(ErrorCode.USER_NOT_FOUND));

            wasTeacher = user.getRole() != null &&
                    "TEACHER".equals(user.getRole().getRoleTitle().name());

            userMapper.updateFromRequest(userRequest, user, roleRepository);
        } else {
            user = userMapper.toEntity(userRequest, roleRepository);

            setPasswordForNewUser(user);
        }

        user = userRepository.save(user);

        // Handle Student/Teacher based on role and scenario
        handleUserRoleSpecificEntity(user, userRequest, isUpdated);

        publishUserEvent(user, isUpdated, wasTeacher);

        return userMapper.toResponse(user);
    }

    private void handleUserRoleSpecificEntity(User user, UserRequest userRequest, boolean isUserUpdate) {
        String role = userRequest.getRole();

        log.info("Handling role-specific entity for user {} with role: {}", user.getId(), role);

        if ("TEACHER".equals(role)) {
            handleTeacherEntity(user, userRequest.getTeacherRequest(), isUserUpdate);
            // Ensure student is null (business rule: one role per user)
            if (user.getStudent() != null) {
                log.info("Removing student entity for user {} due to role change to TEACHER", user.getId());
                studentRepository.delete(user.getStudent());
                user.setStudent(null);
            }
        }
        else if ("STUDENT".equals(role)) {
            handleStudentEntity(user, userRequest.getStudentRequest(), isUserUpdate);
            // Ensure teacher is null (business rule: one role per user)
            if (user.getTeacher() != null) {
                log.info("Removing teacher entity for user {} due to role change to STUDENT", user.getId());
                teacherRepository.delete(user.getTeacher());
                user.setTeacher(null);
            }
        }
        else {
            // Role is neither TEACHER nor STUDENT, remove both relations
            log.info("Role is neither TEACHER nor STUDENT, cleaning up all role-specific entities for user {}", user.getId());
            cleanupAllRoleSpecificEntities(user);
        }
    }

    /**
     * SCENARIO 1: Both new User and new Teacher (create - create)
     * <p>
     * SCENARIO 2: Existing User and existing Teacher (update - update)
     * <p>
     * SCENARIO 3: Existing User and new Teacher (update - create)
     */
    private void handleTeacherEntity(User user, TeacherRequest teacherRequest, boolean isUserUpdate) {
        if (teacherRequest == null) {
            log.info("No teacher data provided for user {}, removing existing teacher if any", user.getId());
            // No teacher data provided, remove existing if any
            if (user.getTeacher() != null) {
                teacherRepository.delete(user.getTeacher());
                user.setTeacher(null);
            }
            return;
        }

        if (isUserUpdate && user.getTeacher() != null && teacherRequest.getId() != null) {
            // SCENARIO 2: Existing User and existing Teacher (update - update)
            log.info("Updating existing teacher {} for user {}", teacherRequest.getId(), user.getId());
            Teacher existingTeacher = user.getTeacher();
            teacherMapper.updateFromRequest(teacherRequest, existingTeacher);
            teacherRepository.save(existingTeacher);
        } else {
            // SCENARIO 1 & 3: Create new Teacher
            log.info("Creating new teacher for user {}", user.getId());

            // Remove existing teacher if any (role change scenario)
            if (user.getTeacher() != null) {
                log.info("Removing existing teacher before creating new one for user {}", user.getId());
                teacherRepository.delete(user.getTeacher());
            }

            Teacher newTeacher = teacherMapper.toEntity(teacherRequest);
            newTeacher.setUser(user);  // Set the saved user reference
            newTeacher = teacherRepository.save(newTeacher);
            user.setTeacher(newTeacher);

            log.info("New teacher created with ID: {} for user {}", newTeacher.getId(), user.getId());
        }
    }

    /**
     * Same pattern as handleTeacherEntity but for Student
     */
    private void handleStudentEntity(User user, StudentRequest studentRequest, boolean isUserUpdate) {
        if (studentRequest == null) {
            log.info("No student data provided for user {}, removing existing student if any", user.getId());
            if (user.getStudent() != null) {
                studentRepository.delete(user.getStudent());
                user.setStudent(null);
            }
            return;
        }

        if (isUserUpdate && user.getStudent() != null && studentRequest.getId() != null) {
            // SCENARIO 2: Existing User and existing Student (update - update)
            log.info("Updating existing student {} for user {}", studentRequest.getId(), user.getId());
            Student existingStudent = user.getStudent();
            studentMapper.updateFromRequest(studentRequest, existingStudent);
            studentRepository.save(existingStudent);
        } else {
            // SCENARIO 1 & 3: Create new Student
            log.info("Creating new student for user {}", user.getId());

            if (user.getStudent() != null) {
                log.info("Removing existing student before creating new one for user {}", user.getId());
                studentRepository.delete(user.getStudent());
            }

            Student newStudent = studentMapper.toEntity(studentRequest);
            newStudent.setUser(user);
            newStudent = studentRepository.save(newStudent);
            user.setStudent(newStudent);

            log.info("New student created with ID: {} for user {}", newStudent.getId(), user.getId());
        }
    }

    private void cleanupAllRoleSpecificEntities(User user) {
        if (user.getTeacher() != null) {
            log.info("Cleaning up teacher entity for user {}", user.getId());
            teacherRepository.delete(user.getTeacher());
            user.setTeacher(null);
        }
        if (user.getStudent() != null) {
            log.info("Cleaning up student entity for user {}", user.getId());
            studentRepository.delete(user.getStudent());
            user.setStudent(null);
        }
    }

    private void setPasswordForNewUser(User user) {
        String rawPassword = passwordUtil.generateRawPassword();
        String hashedPassword = passwordUtil.hashPassword(rawPassword, passwordEncoder);
        user.setPassword(hashedPassword);

//        emailService.sendEmail(user.getEmail(), "Account Created", "Your password is: " + rawPassword);
    }

    private void publishUserEvent(User user, boolean isUpdate, boolean wasTeacher) {
        if (isUpdate) {
            log.info("Publishing user updated event for user {}", user.getId());
            userEventProducer.publishUserUpdated(user);

            // CHECK FOR TEACHER STATUS CHANGES
            checkForTeacherStatusChange(user, wasTeacher);
        } else {
            log.info("Publishing user created event for user {}", user.getId());
            userEventProducer.publishUserCreated(user);
        }
    }

    /**
     * Checks if user's teacher status has changed and publishes appropriate events
     *
     * @param user The updated user entity
     * @param wasTeacher Whether the user was a teacher before the update
     */
    private void checkForTeacherStatusChange(User user, boolean wasTeacher) {
        // Determine current teacher status
        boolean isTeacherNow = user.getRole() != null &&
                "TEACHER".equals(user.getRole().getRoleTitle().name());

        log.info("Teacher status check for user {}: was={}, isNow={}",
                user.getId(), wasTeacher, isTeacherNow);

        // Handle different teacher status change scenarios
        if (wasTeacher && !isTeacherNow) {
            // SCENARIO: User was a teacher but is no longer a teacher
            log.info("User {} is no longer a teacher, publishing teacher role removed event", user.getId());
            teacherEventProducer.publishTeacherRoleRemoved(user);
        }

        // Leave the rest for later logic checking if needed.
    }
}

