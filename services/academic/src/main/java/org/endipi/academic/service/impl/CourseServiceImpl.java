package org.endipi.academic.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.academic.dto.request.CourseRequest;
import org.endipi.academic.dto.response.CourseResponse;
import org.endipi.academic.entity.Course;
import org.endipi.academic.enums.error.ErrorCode;
import org.endipi.academic.exception.ApplicationException;
import org.endipi.academic.mapper.CourseMapper;
import org.endipi.academic.repository.CourseRepository;
import org.endipi.academic.service.CourseService;
import org.hibernate.StaleObjectStateException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {
    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;

    @Value("${retry.course.attempts}")
    private long retryAttempts;

    @Override
    public List<CourseResponse> findAll() {
        return courseRepository.findAll()
                .stream()
                .map(courseMapper::toResponse)
                .toList();
    }

    @Override
    public CourseResponse findById(Long id) {
        return courseRepository.findById(id)
                .map(courseMapper::toResponse)
                .orElseThrow(() -> new ApplicationException(ErrorCode.COURSE_NOT_FOUND));
    }

    @Override
    public CourseResponse saveWithRetry(CourseRequest courseRequest) {
        for (long attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                log.info("Attempt {} to save course with ID: {}", attempt, courseRequest.getId());
                return save(courseRequest);
            } catch (ObjectOptimisticLockingFailureException | StaleObjectStateException e) {
                log.warn("Optimistic lock failure on attempt {} for courseId {}: {}", attempt, courseRequest.getId(), e.getMessage());
                if (attempt == retryAttempts) throw e;
            }
        }

        throw new ApplicationException(ErrorCode.GENERIC_ERROR);
    }

    @Override
    public void deleteById(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new ApplicationException(ErrorCode.COURSE_NOT_FOUND);
        }

        courseRepository.deleteById(id);
    }

    private CourseResponse save(CourseRequest courseRequest) {
        Course course;

        if (courseRequest.getId() != null) {
            course = courseRepository.findById(courseRequest.getId())
                    .orElseThrow(() -> new ApplicationException(ErrorCode.COURSE_NOT_FOUND));

            courseMapper.updateFromRequest(courseRequest, course);
        } else {
            course = courseMapper.toEntity(courseRequest);
        }

        course = courseRepository.save(course);
        return courseMapper.toResponse(course);
    }
}
