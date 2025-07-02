package org.endipi.academic.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.academic.dto.request.DepartmentRequest;
import org.endipi.academic.dto.response.DepartmentResponse;
import org.endipi.academic.entity.Department;
import org.endipi.academic.enums.error.ErrorCode;
import org.endipi.academic.exception.ApplicationException;
import org.endipi.academic.mapper.DepartmentMapper;
import org.endipi.academic.repository.DepartmentRepository;
import org.endipi.academic.service.DepartmentService;
import org.hibernate.StaleObjectStateException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;

    @Value("${retry.department.attempts}")
    private long retryAttempts;

    @Override
    public List<DepartmentResponse> findAll() {
        return departmentRepository.findAll()
                .stream()
                .map(departmentMapper::toResponse)
                .toList();
    }

    @Override
    public DepartmentResponse findById(Long id) {
        return departmentRepository.findById(id)
                .map(departmentMapper::toResponse)
                .orElseThrow(() -> new ApplicationException(ErrorCode.DEPARTMENT_NOT_FOUND));
    }

    @Override
    public DepartmentResponse saveWithRetry(DepartmentRequest departmentRequest) {
        for (long attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                log.info("Attempt {} to save department with ID: {}", attempt, departmentRequest.getId());
                return save(departmentRequest);
            } catch (ObjectOptimisticLockingFailureException | StaleObjectStateException e) {
                log.warn("Optimistic lock failure on attempt {} for departmentId {}: {}", attempt, departmentRequest.getId(), e.getMessage());
                if (attempt == retryAttempts) throw e;
            }
        }

        throw new ApplicationException(ErrorCode.GENERIC_ERROR);
    }

    @Override
    public void deleteById(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new ApplicationException(ErrorCode.DEPARTMENT_NOT_FOUND);
        }

        departmentRepository.deleteById(id);
    }

    @Override
    public Page<DepartmentResponse> findBySearchingCriterion(int page, int size, String sort, String searchValue, String searchCriterion) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort.split(",")[0]).ascending());

        // If no search term, return all users
        if (searchValue == null || searchValue.trim().isEmpty()) {
            return departmentRepository.findAll(pageable)
                    .map(departmentMapper::toResponse);
        }

        // Apply search based on search type
        return switch (searchCriterion) {
            case "name" -> departmentRepository.findByNameContainingIgnoreCase(searchValue.trim(), pageable)
                    .map(departmentMapper::toResponse);
            default ->
                // Fallback to no search
                    departmentRepository.findAll(pageable)
                            .map(departmentMapper::toResponse);
        };
    }

    private DepartmentResponse save(DepartmentRequest departmentRequest) {
        Department department;

        if (departmentRequest.getId() != null) {
            department = departmentRepository.findById(departmentRequest.getId())
                    .orElseThrow(() -> new ApplicationException(ErrorCode.DEPARTMENT_NOT_FOUND));

            departmentMapper.updateFromRequest(departmentRequest, department);
        } else {
            department = departmentMapper.toEntity(departmentRequest);
        }

        department = departmentRepository.save(department);
        return departmentMapper.toResponse(department);
    }
}
