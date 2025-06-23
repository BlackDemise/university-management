package org.endipi.assessment.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.assessment.client.enrollmentservice.EnrollmentServiceClient;
import org.endipi.assessment.dto.request.GradeRequest;
import org.endipi.assessment.dto.response.GradeResponse;
import org.endipi.assessment.entity.Grade;
import org.endipi.assessment.enums.error.ErrorCode;
import org.endipi.assessment.enums.score.ScoreType;
import org.endipi.assessment.exception.ApplicationException;
import org.endipi.assessment.mapper.GradeMapper;
import org.endipi.assessment.repository.GradeRepository;
import org.endipi.assessment.service.GradeService;
import org.hibernate.StaleObjectStateException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GradeServiceImpl implements GradeService {
    private final GradeRepository gradeRepository;
    private final GradeMapper gradeMapper;
    private final EnrollmentServiceClient enrollmentServiceClient;

    @Value("${retry.grade.attempts}")
    private long retryAttempts;

    @Override
    public List<GradeResponse> findAll() {
        return gradeRepository.findAll()
                .stream()
                .map(gradeMapper::toResponse)
                .toList();
    }

    @Override
    public GradeResponse findById(Long id) {
        return gradeRepository.findById(id)
                .map(gradeMapper::toResponse)
                .orElseThrow(() -> new ApplicationException(ErrorCode.GRADE_NOT_FOUND));
    }

    @Override
    public GradeResponse saveWithRetry(GradeRequest gradeRequest) {
        for (long attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                log.info("Attempt {} to save grade with ID: {}", attempt, gradeRequest.getId());
                return save(gradeRequest);
            } catch (ObjectOptimisticLockingFailureException | StaleObjectStateException e) {
                log.warn("Optimistic lock failure on attempt {} for gradeId {}: {}",
                        attempt, gradeRequest.getId(), e.getMessage());
                if (attempt == retryAttempts) throw e;
            }
        }
        throw new ApplicationException(ErrorCode.GENERIC_ERROR);
    }

    @Override
    public void deleteById(Long id) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.GRADE_NOT_FOUND));

        gradeRepository.deleteById(id);
        log.info("Successfully deleted grade with ID: {}", id);
    }

    private GradeResponse save(GradeRequest gradeRequest) {
        Grade grade;
        boolean isUpdate = gradeRequest.getId() != null;

        if (isUpdate) {
            grade = gradeRepository.findById(gradeRequest.getId())
                    .orElseThrow(() -> new ApplicationException(ErrorCode.GRADE_NOT_FOUND));
            gradeMapper.updateFromRequest(gradeRequest, grade);
        } else {
            grade = gradeMapper.toEntity(gradeRequest);
        }

        // Business rule validations
        validateBusinessRules(gradeRequest, isUpdate);

        grade = gradeRepository.save(grade);

        log.info("Successfully {} grade with ID: {} for courseRegistration: {}",
                isUpdate ? "updated" : "created", grade.getId(), grade.getCourseRegistrationId());

        return gradeMapper.toResponse(grade);
    }

    private void validateBusinessRules(GradeRequest gradeRequest, boolean isUpdate) {
        // 1. Validate score value range [0, 10]
        if (gradeRequest.getScoreValue() != null) {
            if (gradeRequest.getScoreValue() < 0 || gradeRequest.getScoreValue() > 10) {
                throw new ApplicationException(ErrorCode.INVALID_SCORE_VALUE);
            }
        }

        // 2. Validate course registration exists
        boolean validation = enrollmentServiceClient.validateCourseRegistration(gradeRequest.getCourseRegistrationId());
        if (!validation) {
            throw new ApplicationException(ErrorCode.COURSE_REGISTRATION_NOT_FOUND);
        }

        // 3. Check for duplicate grade entries (same scoreType for same courseRegistration)
         if (!isUpdate) {
             boolean exists = gradeRepository.existsByCourseRegistrationIdAndScoreType(
                 gradeRequest.getCourseRegistrationId(),
                 ScoreType.valueOf(gradeRequest.getScoreType())
             );
             if (exists) {
                 throw new ApplicationException(ErrorCode.DUPLICATE_GRADE_ENTRY);
             }
         }

        log.info("Validating business rules for grade - CourseRegistration: {}, ScoreType: {}, Value: {}",
                gradeRequest.getCourseRegistrationId(), gradeRequest.getScoreType(), gradeRequest.getScoreValue());
    }
}