package org.endipi.academic.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.academic.client.userservice.UserServiceClient;
import org.endipi.academic.dto.external.TeacherValidationResponse;
import org.endipi.academic.dto.request.DepartmentMemberRequest;
import org.endipi.academic.dto.response.DepartmentMemberResponse;
import org.endipi.academic.entity.DepartmentMember;
import org.endipi.academic.enums.error.ErrorCode;
import org.endipi.academic.exception.ApplicationException;
import org.endipi.academic.mapper.DepartmentMemberMapper;
import org.endipi.academic.repository.DepartmentMemberRepository;
import org.endipi.academic.repository.DepartmentRepository;
import org.endipi.academic.service.DepartmentMemberService;
import org.hibernate.StaleObjectStateException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DepartmentMemberServiceImpl implements DepartmentMemberService {
    private final DepartmentMemberRepository departmentMemberRepository;
    private final DepartmentMemberMapper departmentMemberMapper;
    private final DepartmentRepository departmentRepository;
    private final UserServiceClient userServiceClient;

    @Value("${retry.department-member.attempts}")
    private long retryAttempts;

    @Override
    public List<DepartmentMemberResponse> findAll() {
        return departmentMemberRepository.findAll()
                .stream()
                .map(departmentMemberMapper::toResponse)
                .toList();
    }

    @Override
    public DepartmentMemberResponse findById(Long id) {
        return departmentMemberRepository.findById(id)
                .map(departmentMemberMapper::toResponse)
                .orElseThrow(() -> new ApplicationException(ErrorCode.DEPARTMENT_MEMBER_NOT_FOUND));
    }

    @Override
    public DepartmentMemberResponse saveWithRetry(DepartmentMemberRequest departmentMemberRequest) {
        for (long attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                log.info("Attempt {} to save departmentMember with ID: {}", attempt, departmentMemberRequest.getId());
                return save(departmentMemberRequest);
            } catch (ObjectOptimisticLockingFailureException | StaleObjectStateException e) {
                log.warn("Optimistic lock failure on attempt {} for departmentMemberId {}: {}", attempt, departmentMemberRequest.getId(), e.getMessage());
                if (attempt == retryAttempts) throw e;
            }
        }

        throw new ApplicationException(ErrorCode.GENERIC_ERROR);
    }

    @Override
    public void deleteById(Long id) {
        if (!departmentMemberRepository.existsById(id)) {
            throw new ApplicationException(ErrorCode.DEPARTMENT_MEMBER_NOT_FOUND);
        }

        departmentMemberRepository.deleteById(id);
    }

    @Override
    public List<DepartmentMemberResponse> findByDepartmentId(Long departmentId) {
        return departmentMemberRepository.findByDepartmentId(departmentId)
                .stream()
                .map(departmentMemberMapper::toResponse)
                .toList();
    }

    @Override
    public List<DepartmentMemberResponse> findByTeacherId(Long teacherId) {
        return departmentMemberRepository.findByTeacherId(teacherId)
                .stream()
                .map(departmentMemberMapper::toResponse)
                .toList();
    }

    // In DepartmentMemberServiceImpl:
    @Override
    @Transactional
    public void deleteAllByTeacherId(Long teacherId) {
        List<DepartmentMember> memberships = departmentMemberRepository.findByTeacherId(teacherId);

        log.info("Removing {} department memberships for teacher: {}", memberships.size(), teacherId);

        departmentMemberRepository.deleteByTeacherId(teacherId);
    }

    // MAIN BUSINESS LOGIC WITH S2S VALIDATION
    private DepartmentMemberResponse save(DepartmentMemberRequest departmentMemberRequest) {
        // S2S Validation: Check if teacher exists and has TEACHER role
        validateTeacherEligibility(departmentMemberRequest.getTeacherId());

        DepartmentMember departmentMember;
        boolean isUpdate = departmentMemberRequest.getId() != null;

        if (isUpdate) {
            // UPDATE scenario
            departmentMember = departmentMemberRepository.findById(departmentMemberRequest.getId())
                    .orElseThrow(() -> new ApplicationException(ErrorCode.DEPARTMENT_MEMBER_NOT_FOUND));

            // If teacher is being changed, validate new teacher
            if (!departmentMember.getTeacherId().equals(departmentMemberRequest.getTeacherId())) {
                validateTeacherEligibility(departmentMemberRequest.getTeacherId());
            }

            departmentMemberMapper.updateFromRequest(departmentMemberRequest, departmentMember, departmentRepository);
        } else {
            // CREATE scenario: Check for duplicates
            validateNoDuplicateMembership(departmentMemberRequest);

            departmentMember = departmentMemberMapper.toEntity(departmentMemberRequest, departmentRepository);
        }

        departmentMember = departmentMemberRepository.save(departmentMember);
        return departmentMemberMapper.toResponse(departmentMember);
    }

    // S2S CALL FOR TEACHER VALIDATION
    private void validateTeacherEligibility(Long teacherId) {
        try {
            TeacherValidationResponse validation = userServiceClient.validateTeacher(teacherId);

            if (!validation.isExists()) {
                throw new ApplicationException(ErrorCode.TEACHER_NOT_FOUND);
            }

            if (!validation.isTeacher()) {
                throw new ApplicationException(ErrorCode.USER_NOT_A_TEACHER);
            }

            log.info("Teacher validation successful: {} ({})", validation.getFullName(), validation.getTeacherCode());

        } catch (Exception e) {
            log.error("Failed to validate teacher with ID: {}", teacherId, e);
            throw new ApplicationException(ErrorCode.TEACHER_VALIDATION_FAILED);
        }
    }

    private void validateNoDuplicateMembership(DepartmentMemberRequest request) {
        boolean exists = departmentMemberRepository.existsByDepartmentIdAndTeacherId(
                request.getDepartmentId(), request.getTeacherId());

        if (exists) {
            throw new ApplicationException(ErrorCode.DUPLICATE_DEPARTMENT_MEMBERSHIP);
        }
    }
}