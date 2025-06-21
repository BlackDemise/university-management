package org.endipi.enrollment.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.enrollment.dto.request.CourseOfferingRequest;
import org.endipi.enrollment.dto.response.CourseOfferingResponse;
import org.endipi.enrollment.entity.CourseOffering;
import org.endipi.enrollment.enums.error.ErrorCode;
import org.endipi.enrollment.exception.ApplicationException;
import org.endipi.enrollment.mapper.CourseOfferingMapper;
import org.endipi.enrollment.repository.CourseOfferingRepository;
import org.endipi.enrollment.repository.SemesterRepository;
import org.endipi.enrollment.service.CourseOfferingService;
import org.hibernate.StaleObjectStateException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CourseOfferingServiceImpl implements CourseOfferingService {
    private final CourseOfferingRepository courseOfferingRepository;
    private final CourseOfferingMapper courseOfferingMapper;
    private final SemesterRepository semesterRepository;

    @Value("${retry.course-offering.attempts}")
    private long retryAttempts;

    @Override
    public List<CourseOfferingResponse> findAll() {
        return courseOfferingRepository.findAll()
                .stream()
                .map(courseOfferingMapper::toResponse)
                .toList();
    }

    @Override
    public CourseOfferingResponse findById(Long id) {
        return courseOfferingRepository.findById(id)
                .map(courseOfferingMapper::toResponse)
                .orElseThrow(() -> new ApplicationException(ErrorCode.COURSE_OFFERING_NOT_FOUND));
    }

    @Override
    public CourseOfferingResponse saveWithRetry(CourseOfferingRequest request) {
        for (long attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                log.info("Attempt {} to save course offering with ID: {}", attempt, request.getId());
                return save(request);
            } catch (ObjectOptimisticLockingFailureException | StaleObjectStateException e) {
                log.warn("Optimistic lock failure on attempt {} for courseOfferingId {}: {}",
                        attempt, request.getId(), e.getMessage());
                if (attempt == retryAttempts) throw e;
            }
        }
        throw new ApplicationException(ErrorCode.GENERIC_ERROR);
    }

    private CourseOfferingResponse save(CourseOfferingRequest request) {
        CourseOffering courseOffering;
        boolean isUpdate = request.getId() != null;

        if (isUpdate) {
            courseOffering = courseOfferingRepository.findById(request.getId())
                    .orElseThrow(() -> new ApplicationException(ErrorCode.COURSE_OFFERING_NOT_FOUND));
            courseOfferingMapper.updateFromRequest(request, courseOffering, semesterRepository);
        } else {
            courseOffering = courseOfferingMapper.toEntity(request, semesterRepository);
        }

        // TODO: Add S2S validation calls here:
        // - validateCourse(request.getCourseId())
        // - validateTeacher(request.getTeacherId())
        // - validateClassroom(request.getClassroomId())

        courseOffering = courseOfferingRepository.save(courseOffering);
        return courseOfferingMapper.toResponse(courseOffering);
    }

    @Override
    public void deleteById(Long id) {
        if (!courseOfferingRepository.existsById(id)) {
            throw new ApplicationException(ErrorCode.COURSE_OFFERING_NOT_FOUND);
        }

        courseOfferingRepository.deleteById(id);
    }
}
