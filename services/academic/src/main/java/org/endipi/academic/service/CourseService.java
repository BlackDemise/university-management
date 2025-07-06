package org.endipi.academic.service;

import org.endipi.academic.dto.request.CourseRequest;
import org.endipi.academic.dto.response.CourseBasicInfo;
import org.endipi.academic.dto.response.CourseResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface CourseService {
    List<CourseResponse> findAll();

    CourseResponse findById(Long id);

    CourseResponse saveWithRetry(CourseRequest courseRequest);

    void deleteById(Long id);

    Page<CourseResponse> findBySearchingCriterion(int page, int size, String sort, String searchValue, String searchCriterion);

    // This helps enrollment-service to retreive courseName by id in a batch instead of one by one
    Map<Long, String> getCourseNamesByIds(Set<Long> ids); // Map<courseId, courseName>

    // This helps enrollment-service to retrieve course codes and names by id in a batch
    Map<Long, CourseBasicInfo> getCourseBasicInfoByIds(Set<Long> ids); // Map<courseId, CourseBasicInfo>

    // Endpoints for S2S communication
    boolean validateCourse(Long courseId);
}
