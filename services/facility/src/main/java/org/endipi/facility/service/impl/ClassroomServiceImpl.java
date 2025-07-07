package org.endipi.facility.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.facility.dto.external.ClassroomValidationResponse;
import org.endipi.facility.dto.request.ClassroomRequest;
import org.endipi.facility.dto.response.ClassroomDetailsResponse;
import org.endipi.facility.dto.response.ClassroomResponse;
import org.endipi.facility.entity.Classroom;
import org.endipi.facility.enums.error.ErrorCode;
import org.endipi.facility.exception.ApplicationException;
import org.endipi.facility.mapper.ClassroomMapper;
import org.endipi.facility.repository.ClassroomRepository;
import org.endipi.facility.service.ClassroomService;
import org.hibernate.StaleObjectStateException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

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

    @Override
    public Page<ClassroomResponse> findBySearchingCriterion(int page, int size, String sort, String searchValue, String searchCriterion) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort.split(",")[0]).ascending());

        // If no search term, return all users
        if (searchValue == null || searchValue.trim().isEmpty()) {
            return classroomRepository.findAll(pageable)
                    .map(classroomMapper::toResponse);
        }

        // Apply search based on search type
        return switch (searchCriterion) {
            case "roomNumber" -> classroomRepository.findByRoomNumberContainingIgnoreCase(searchValue.trim(), pageable)
                    .map(classroomMapper::toResponse);
            case "building" -> classroomRepository.findByBuildingContainingIgnoreCase(searchValue.trim(), pageable)
                    .map(classroomMapper::toResponse);
            default ->
                // Fallback to no search
                    classroomRepository.findAll(pageable)
                            .map(classroomMapper::toResponse);
        };
    }

    @Override
    public ClassroomValidationResponse validateClassroom(Long classroomId) {
        return classroomRepository.findById(classroomId)
                .map((c) -> ClassroomValidationResponse.builder()
                        .isExists(true)
                        .classroomType(c.getClassroomType().name())
                        .build())
                .orElse(ClassroomValidationResponse.builder()
                        .isExists(false)
                        .build());
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

    @Override
    public Map<Long, ClassroomDetailsResponse> getClassroomDetailsByIds(Set<Long> classroomIds) {
        log.info("Getting classroom details for {} IDs", classroomIds.size());

        List<Classroom> classrooms = classroomRepository.findAllById(classroomIds);

        return classrooms.stream()
                .collect(Collectors.toMap(
                        Classroom::getId,
                        classroom -> ClassroomDetailsResponse.builder()
                                .id(classroom.getId())
                                .name(classroom.getRoomNumber())
                                .classroomType(classroom.getClassroomType().getClassroomType())
                                .capacity(classroom.getCapacity())
                                .build()
                ));
    }

    @Override
    public List<ClassroomDetailsResponse> getAllClassroomsWithDetails() {
        log.info("Getting all classrooms with details");

        List<Classroom> classrooms = classroomRepository.findAll();

        return classrooms.stream()
                .map(classroom -> ClassroomDetailsResponse.builder()
                        .id(classroom.getId())
                        .name(classroom.getRoomNumber())
                        .classroomType(classroom.getClassroomType().getClassroomType())
                        .capacity(classroom.getCapacity())
                        .build())
                .collect(Collectors.toList());
    }
}
