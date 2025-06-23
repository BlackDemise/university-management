package org.endipi.academic.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.academic.dto.request.MajorRequest;
import org.endipi.academic.dto.response.MajorResponse;
import org.endipi.academic.entity.Major;
import org.endipi.academic.enums.error.ErrorCode;
import org.endipi.academic.exception.ApplicationException;
import org.endipi.academic.mapper.MajorMapper;
import org.endipi.academic.repository.DepartmentRepository;
import org.endipi.academic.repository.MajorRepository;
import org.endipi.academic.service.MajorService;
import org.hibernate.StaleObjectStateException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MajorServiceImpl implements MajorService {
    private final MajorRepository majorRepository;
    private final MajorMapper majorMapper;
    private final DepartmentRepository departmentRepository;

    @Value("${retry.major.attempts}")
    private long retryAttempts;

    @Override
    public List<MajorResponse> findAll() {
        return majorRepository.findAll()
                .stream()
                .map(majorMapper::toResponse)
                .toList();
    }

    @Override
    public MajorResponse findById(Long id) {
        return majorRepository.findById(id)
                .map(majorMapper::toResponse)
                .orElseThrow(() -> new ApplicationException(ErrorCode.MAJOR_NOT_FOUND));
    }

    @Override
    public MajorResponse saveWithRetry(MajorRequest majorRequest) {
        for (long attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                log.info("Attempt {} to save major with ID: {}", attempt, majorRequest.getId());
                return save(majorRequest);
            } catch (ObjectOptimisticLockingFailureException | StaleObjectStateException e) {
                log.warn("Optimistic lock failure on attempt {} for majorId {}: {}", attempt, majorRequest.getId(), e.getMessage());
                if (attempt == retryAttempts) throw e;
            }
        }

        throw new ApplicationException(ErrorCode.GENERIC_ERROR);
    }

    @Override
    public void deleteById(Long id) {
        if (!majorRepository.existsById(id)) {
            throw new ApplicationException(ErrorCode.MAJOR_NOT_FOUND);
        }

        majorRepository.deleteById(id);
    }

    @Override
    public boolean validateMajor(Long majorId) {
        return majorRepository.existsById(majorId);
    }

    private MajorResponse save(MajorRequest majorRequest) {
        Major major;

        if (majorRequest.getId() != null) {
            major = majorRepository.findById(majorRequest.getId())
                    .orElseThrow(() -> new ApplicationException(ErrorCode.MAJOR_NOT_FOUND));

            majorMapper.updateFromRequest(majorRequest, major, departmentRepository);
        } else {
            major = majorMapper.toEntity(majorRequest, departmentRepository);
        }

        validateBusinessRules(major);

        major = majorRepository.save(major);
        return majorMapper.toResponse(major);
    }

    private void validateBusinessRules(Major major) {
        if (major.getTotalCreditsRequired() != null && major.getTotalCreditsRequired() < 0) {
            throw new ApplicationException(ErrorCode.INVALID_CREDITS_REQUIRED);
        }
    }
}
