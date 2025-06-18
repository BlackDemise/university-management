package org.endipi.user.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.user.dto.request.UserRequest;
import org.endipi.user.dto.response.UserResponse;
import org.endipi.user.entity.User;
import org.endipi.user.enums.error.ErrorCode;
import org.endipi.user.exception.ApplicationException;
import org.endipi.user.mapper.UserMapper;
import org.endipi.user.producer.UserEventProducer;
import org.endipi.user.repository.RoleRepository;
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

        userRepository.deleteById(id);

        userEventProducer.publishUserDeleted(user);
    }

    private UserResponse save(UserRequest userRequest) {
        User user;
        boolean isUpdated;

        if (userRequest.getId() != null) {
            user = userRepository.findById(userRequest.getId())
                    .orElseThrow(() -> new ApplicationException(ErrorCode.USER_NOT_FOUND));

            userMapper.updateFromRequest(userRequest, user, roleRepository);

            isUpdated = true;
        } else {
            user = userMapper.toEntity(userRequest, roleRepository);

            String rawPassword = passwordUtil.generateRawPassword();
            String hashedPassword = passwordUtil.hashPassword(rawPassword, passwordEncoder);
            user.setPassword(hashedPassword);

            emailService.sendEmail(user.getEmail(), "Your account has been created", "Your password is: " + rawPassword);

            isUpdated = false;
        }

        user = userRepository.save(user);

        if (isUpdated) {
            userEventProducer.publishUserUpdated(user);
        } else {
            userEventProducer.publishUserCreated(user);
        }

        return userMapper.toResponse(user);
    }
}

