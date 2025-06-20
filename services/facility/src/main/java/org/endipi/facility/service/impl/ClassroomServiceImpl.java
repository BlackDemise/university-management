package org.endipi.facility.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.facility.dto.request.ClassroomRequest;
import org.endipi.facility.dto.response.ClassroomResponse;
import org.endipi.facility.entity.Classroom;
import org.endipi.facility.enums.error.ErrorCode;
import org.endipi.facility.exception.ApplicationException;
import org.endipi.facility.mapper.ClassroomMapper;
import org.endipi.facility.repository.ClassroomRepository;
import org.endipi.facility.service.ClassroomService;
import org.hibernate.StaleObjectStateException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClassroomServiceImpl implements ClassroomService {
    private final ClassroomRepository classroomRepository;
    private final ClassroomMapper classroomMapper;

    @Value("${retry.classroom.attempts}")
    private long retryAttempts;

    @Override
    public List<ClassroomResponse> findAll() {
        return classroomRepository.findAll()
                .stream()
                .map(classroomMapper::toResponse)
                .toList();
    }

    @Override
    public ClassroomResponse findById(Long id) {
        return classroomRepository.findById(id)
                .map(classroomMapper::toResponse)
                .orElseThrow(() -> new ApplicationException(ErrorCode.CLASSROOM_NOT_FOUND));
    }

    @Override
    public ClassroomResponse saveWithRetry(ClassroomRequest classroomRequest) {
        for (long attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                log.info("Attempt {} to save classroom with ID: {}", attempt, classroomRequest.getId());
                return save(classroomRequest);
            } catch (ObjectOptimisticLockingFailureException | StaleObjectStateException e) {
                log.warn("Optimistic lock failure on attempt {} for classroomId {}: {}",
                        attempt, classroomRequest.getId(), e.getMessage());
                if (attempt == retryAttempts) throw e;
            }
        }

        throw new ApplicationException(ErrorCode.GENERIC_ERROR);
    }

    @Override
    public void deleteById(Long id) {
        if (!classroomRepository.existsById(id)) {
            throw new ApplicationException(ErrorCode.CLASSROOM_NOT_FOUND);
        }

        classroomRepository.deleteById(id);
    }

    private ClassroomResponse save(ClassroomRequest classroomRequest) {
        Classroom classroom;
        boolean isUpdated = classroomRequest.getId() != null;

        if (isUpdated) {
            classroom = classroomRepository.findById(classroomRequest.getId())
                    .orElseThrow(() -> new ApplicationException(ErrorCode.CLASSROOM_NOT_FOUND));

            classroomMapper.updateFromRequest(classroomRequest, classroom);
        } else {
            classroom = classroomMapper.toEntity(classroomRequest);
        }

        classroom = classroomRepository.save(classroom);

        return classroomMapper.toResponse(classroom);
    }
}
