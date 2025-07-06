package org.endipi.academic.service;

import org.endipi.academic.dto.request.PrerequisiteCourseRequest;
import org.endipi.academic.dto.request.UpdatePrerequisitesRequest;
import org.endipi.academic.dto.response.CoursePrerequisiteDetailsResponse;
import org.endipi.academic.dto.response.CoursePrerequisiteSummaryResponse;
import org.endipi.academic.dto.response.PrerequisiteCourseResponse;

import java.util.List;

public interface PrerequisiteCourseService {
    List<PrerequisiteCourseResponse> findAll();

    PrerequisiteCourseResponse findById(Long id);

    PrerequisiteCourseResponse saveWithRetry(PrerequisiteCourseRequest prerequisiteCourseRequest);

    void deleteById(Long id);
    
    // Enhanced methods for prerequisite management
    List<CoursePrerequisiteSummaryResponse> getAllCoursesWithPrerequisiteInfo();
    
    CoursePrerequisiteDetailsResponse getCoursePrerequisiteDetails(Long courseId);
    
    void updateCoursePrerequisites(UpdatePrerequisitesRequest request);
    
    List<CoursePrerequisiteDetailsResponse.CourseOption> getAvailablePrerequisiteOptions(Long courseId);
    
    boolean validatePrerequisiteAddition(Long courseId, Long prerequisiteCourseId);
}
