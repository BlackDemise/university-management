package org.endipi.academic.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.academic.dto.request.PrerequisiteCourseRequest;
import org.endipi.academic.dto.request.UpdatePrerequisitesRequest;
import org.endipi.academic.dto.response.CoursePrerequisiteDetailsResponse;
import org.endipi.academic.dto.response.CoursePrerequisiteSummaryResponse;
import org.endipi.academic.dto.response.PrerequisiteCourseResponse;
import org.endipi.academic.entity.Course;
import org.endipi.academic.entity.PrerequisiteCourse;
import org.endipi.academic.enums.error.ErrorCode;
import org.endipi.academic.exception.ApplicationException;
import org.endipi.academic.mapper.PrerequisiteCourseMapper;
import org.endipi.academic.repository.CourseRepository;
import org.endipi.academic.repository.PrerequisiteCourseRepository;
import org.endipi.academic.service.PrerequisiteCourseService;
import org.hibernate.StaleObjectStateException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PrerequisiteCourseServiceImpl implements PrerequisiteCourseService {
    private final PrerequisiteCourseRepository prerequisiteCourseRepository;
    private final PrerequisiteCourseMapper prerequisiteCourseMapper;
    private final CourseRepository courseRepository;

    @Value("${retry.prerequisite-course.attempts}")
    private long retryAttempts;

    @Override
    public List<PrerequisiteCourseResponse> findAll() {
        return prerequisiteCourseRepository.findAll()
                .stream()
                .map(prerequisiteCourseMapper::toResponse)
                .toList();
    }

    @Override
    public PrerequisiteCourseResponse findById(Long id) {
        return prerequisiteCourseRepository.findById(id)
                .map(prerequisiteCourseMapper::toResponse)
                .orElseThrow(() -> new ApplicationException(ErrorCode.PREREQUISITE_COURSE_NOT_FOUND));
    }

    @Override
    public PrerequisiteCourseResponse saveWithRetry(PrerequisiteCourseRequest prerequisiteCourseRequest) {
        for (long attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                log.info("Attempt {} to save prerequisiteCourse with ID: {}", attempt, prerequisiteCourseRequest.getId());
                return save(prerequisiteCourseRequest);
            } catch (ObjectOptimisticLockingFailureException | StaleObjectStateException e) {
                log.warn("Optimistic lock failure on attempt {} for prerequisiteCourseId {}: {}", attempt, prerequisiteCourseRequest.getId(), e.getMessage());
                if (attempt == retryAttempts) throw e;
            }
        }

        throw new ApplicationException(ErrorCode.GENERIC_ERROR);
    }

    @Override
    public void deleteById(Long id) {
        if (!prerequisiteCourseRepository.existsById(id)) {
            throw new ApplicationException(ErrorCode.PREREQUISITE_COURSE_NOT_FOUND);
        }

        prerequisiteCourseRepository.deleteById(id);
    }

    private PrerequisiteCourseResponse save(PrerequisiteCourseRequest prerequisiteCourseRequest) {
        // Business Logic Validation
        validateBusinessRules(prerequisiteCourseRequest);

        PrerequisiteCourse prerequisiteCourse;
        boolean isUpdate = prerequisiteCourseRequest.getId() != null;

        if (isUpdate) {
            // UPDATE scenario: Load existing entity and update it
            prerequisiteCourse = prerequisiteCourseRepository.findById(prerequisiteCourseRequest.getId())
                    .orElseThrow(() -> new ApplicationException(ErrorCode.PREREQUISITE_COURSE_NOT_FOUND));

            // Use mapper to update existing entity with new data
            prerequisiteCourseMapper.updateFromRequest(prerequisiteCourseRequest, prerequisiteCourse, courseRepository);
        } else {
            // CREATE scenario: Check for duplicates first
            validateNoDuplicatePrerequisite(prerequisiteCourseRequest);

            // Create new entity from request
            prerequisiteCourse = prerequisiteCourseMapper.toEntity(prerequisiteCourseRequest, courseRepository);
        }

        // Save the entity (works for both create and update)
        prerequisiteCourse = prerequisiteCourseRepository.save(prerequisiteCourse);

        // Convert to response DTO and return
        return prerequisiteCourseMapper.toResponse(prerequisiteCourse);
    }

    // BUSINESS LOGIC VALIDATION
    private void validateBusinessRules(PrerequisiteCourseRequest request) {
        // Rule 1: Course cannot be its own prerequisite
        if (request.getCourseId().equals(request.getPrerequisiteCourseId())) {
            throw new ApplicationException(ErrorCode.COURSE_CANNOT_BE_ITS_OWN_PREREQUISITE);
        }

        // Rule 2: Both courses must exist (this will be checked by mapper, but good to validate early)
        validateCoursesExist(request.getCourseId(), request.getPrerequisiteCourseId());

        // Rule 3: Check for circular dependencies (optional advanced validation)
        validateNoCircularDependency(request);
    }

    private void validateCoursesExist(Long courseId, Long prerequisiteCourseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ApplicationException(ErrorCode.COURSE_NOT_FOUND);
        }
        if (!courseRepository.existsById(prerequisiteCourseId)) {
            throw new ApplicationException(ErrorCode.COURSE_NOT_FOUND);
        }
    }

    private void validateNoDuplicatePrerequisite(PrerequisiteCourseRequest request) {
        // Check if this prerequisite relationship already exists
        boolean exists = prerequisiteCourseRepository.existsByCourseIdAndPrerequisiteCourseId(
                request.getCourseId(), request.getPrerequisiteCourseId());

        if (exists) {
            throw new ApplicationException(ErrorCode.DUPLICATE_PREREQUISITE_RELATIONSHIP);
        }
    }

    // Prevent circular dependencies
    private void validateNoCircularDependency(PrerequisiteCourseRequest request) {
        // Check if prerequisiteCourseId already depends on courseId (would create a cycle)
        // This prevents: Course A -> Course B -> Course A
        if (hasPrerequisiteRelationship(request.getPrerequisiteCourseId(), request.getCourseId())) {
            throw new ApplicationException(ErrorCode.CIRCULAR_PREREQUISITE_DEPENDENCY);
        }
    }

    private boolean hasPrerequisiteRelationship(Long courseId, Long potentialPrerequisiteId) {
        // Check if courseId has potentialPrerequisiteId as a prerequisite (directly or indirectly)
        return prerequisiteCourseRepository.existsByCourseIdAndPrerequisiteCourseId(courseId, potentialPrerequisiteId);
    }
    
    // ===============================
    // ENHANCED METHODS FOR UI SUPPORT
    // ===============================
    
    @Override
    @Transactional(readOnly = true)
    public List<CoursePrerequisiteSummaryResponse> getAllCoursesWithPrerequisiteInfo() {
        List<Course> allCourses = courseRepository.findAll();
        
        // Optimize: Build department mapping for all courses at once to avoid N+1 queries
        Map<Long, String> courseDepartmentMap = buildCourseDepartmentMap();
        
        return allCourses.stream()
                .map(course -> buildCourseSummaryResponseOptimized(course, courseDepartmentMap))
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public CoursePrerequisiteDetailsResponse getCoursePrerequisiteDetails(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ApplicationException(ErrorCode.COURSE_NOT_FOUND));
        
        // Get prerequisites for this course
        List<PrerequisiteCourse> prerequisites = prerequisiteCourseRepository.findByCourseId(courseId);
        
        // Get courses that require this course as prerequisite
        List<PrerequisiteCourse> requiredByOthers = prerequisiteCourseRepository.findByPrerequisiteCourseId(courseId);
        
        // Get available courses that can be added as prerequisites
        List<CoursePrerequisiteDetailsResponse.CourseOption> availableOptions = getAvailablePrerequisiteOptions(courseId);
        
        // Check for any circular dependency warnings
        List<String> warnings = detectCircularDependencyWarnings(courseId);
        
        return CoursePrerequisiteDetailsResponse.builder()
                .course(buildCourseInfo(course))
                .prerequisites(prerequisites.stream()
                        .map(pc -> buildPrerequisiteCourseInfo(pc.getPrerequisiteCourse(), true))
                        .collect(Collectors.toList()))
                .requiredByOthers(requiredByOthers.stream()
                        .map(pc -> buildPrerequisiteCourseInfo(pc.getCourse(), false))
                        .collect(Collectors.toList()))
                .availableAsPrerequisites(availableOptions)
                .circularDependencyWarnings(warnings)
                .build();
    }
    
    @Override
    @Transactional
    public void updateCoursePrerequisites(UpdatePrerequisitesRequest request) {
        // Validate course exists
        if (!courseRepository.existsById(request.getCourseId())) {
            throw new ApplicationException(ErrorCode.COURSE_NOT_FOUND);
        }
        
        // Add new prerequisites
        if (request.getPrerequisiteIdsToAdd() != null && !request.getPrerequisiteIdsToAdd().isEmpty()) {
            for (Long prerequisiteId : request.getPrerequisiteIdsToAdd()) {
                // Validate before adding
                if (!validatePrerequisiteAddition(request.getCourseId(), prerequisiteId)) {
                    throw new ApplicationException(ErrorCode.INVALID_PREREQUISITE_ADDITION);
                }
                
                // Check if relationship already exists
                if (!prerequisiteCourseRepository.existsByCourseIdAndPrerequisiteCourseId(
                        request.getCourseId(), prerequisiteId)) {
                    PrerequisiteCourse newPrerequisite = PrerequisiteCourse.builder()
                            .course(courseRepository.getReferenceById(request.getCourseId()))
                            .prerequisiteCourse(courseRepository.getReferenceById(prerequisiteId))
                            .build();
                    prerequisiteCourseRepository.save(newPrerequisite);
                }
            }
        }
        
        // Remove prerequisites
        if (request.getPrerequisiteIdsToRemove() != null && !request.getPrerequisiteIdsToRemove().isEmpty()) {
            List<PrerequisiteCourse> toRemove = prerequisiteCourseRepository.findByCourseId(request.getCourseId())
                    .stream()
                    .filter(pc -> request.getPrerequisiteIdsToRemove().contains(pc.getPrerequisiteCourse().getId()))
                    .collect(Collectors.toList());
            
            prerequisiteCourseRepository.deleteAll(toRemove);
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CoursePrerequisiteDetailsResponse.CourseOption> getAvailablePrerequisiteOptions(Long courseId) {
        // Get all courses except the current one
        List<Course> allCourses = courseRepository.findAll();
        
        // Get already assigned prerequisites
        Set<Long> existingPrerequisiteIds = prerequisiteCourseRepository.findByCourseId(courseId)
                .stream()
                .map(pc -> pc.getPrerequisiteCourse().getId())
                .collect(Collectors.toSet());
        
        return allCourses.stream()
                .filter(course -> !course.getId().equals(courseId)) // Exclude self
                .filter(course -> !existingPrerequisiteIds.contains(course.getId())) // Exclude existing
                .filter(course -> !wouldCreateCircularDependency(courseId, course.getId())) // Exclude circular
                .map(this::buildCourseOption)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean validatePrerequisiteAddition(Long courseId, Long prerequisiteCourseId) {
        // Check if both courses exist
        if (!courseRepository.existsById(courseId) || !courseRepository.existsById(prerequisiteCourseId)) {
            return false;
        }
        
        // Check if course is trying to be its own prerequisite
        if (courseId.equals(prerequisiteCourseId)) {
            return false;
        }
        
        // Check if relationship already exists
        if (prerequisiteCourseRepository.existsByCourseIdAndPrerequisiteCourseId(courseId, prerequisiteCourseId)) {
            return false;
        }
        
        // Check for circular dependency
        return !wouldCreateCircularDependency(courseId, prerequisiteCourseId);
    }
    
    // ===============================
    // HELPER METHODS
    // ===============================
    
    private Map<Long, String> buildCourseDepartmentMap() {
        List<CourseRepository.CourseDepartmentProjection> courseDepartments = 
                courseRepository.findAllCoursesWithDepartments();
        
        // Group departments by course ID
        Map<Long, List<String>> courseDepartmentGroups = courseDepartments.stream()
                .collect(Collectors.groupingBy(
                        CourseRepository.CourseDepartmentProjection::getCourseId,
                        Collectors.mapping(
                                CourseRepository.CourseDepartmentProjection::getDepartmentName,
                                Collectors.toList()
                        )
                ));
        
        // Convert to final format with joined department names
        Map<Long, String> courseDepartmentMap = new HashMap<>();
        
        courseDepartmentGroups.forEach((courseId, departments) -> {
            if (departments.isEmpty()) {
                courseDepartmentMap.put(courseId, "Khoa không xác định");
            } else if (departments.size() == 1) {
                courseDepartmentMap.put(courseId, departments.get(0));
            } else {
                // Remove duplicates and sort for consistent display
                String joinedDepartments = departments.stream()
                        .distinct()
                        .sorted()
                        .collect(Collectors.joining(" | "));
                courseDepartmentMap.put(courseId, joinedDepartments);
            }
        });
        
        return courseDepartmentMap;
    }
    
    private CoursePrerequisiteSummaryResponse buildCourseSummaryResponseOptimized(Course course, Map<Long, String> courseDepartmentMap) {
        Long prerequisiteCount = prerequisiteCourseRepository.countPrerequisitesByCourseId(course.getId());
        boolean isPrerequisiteForOthers = prerequisiteCourseRepository.isPrerequisiteForOtherCourses(course.getId());
        boolean hasCircularDependency = hasCircularDependencyIssues(course.getId());
        
        return CoursePrerequisiteSummaryResponse.builder()
                .courseId(course.getId())
                .courseCode(course.getCode())
                .courseName(course.getName())
                .numberOfPrequisiteCourses(prerequisiteCount)
                .hasCircularDependency(hasCircularDependency)
                .isPrequisiteForOtherCourses(isPrerequisiteForOthers)
                .departmentName(courseDepartmentMap.getOrDefault(course.getId(), "Khoa không xác định"))
                .build();
    }
    
    private CoursePrerequisiteSummaryResponse buildCourseSummaryResponse(Course course) {
        Long prerequisiteCount = prerequisiteCourseRepository.countPrerequisitesByCourseId(course.getId());
        boolean isPrerequisiteForOthers = prerequisiteCourseRepository.isPrerequisiteForOtherCourses(course.getId());
        boolean hasCircularDependency = hasCircularDependencyIssues(course.getId());
        
        return CoursePrerequisiteSummaryResponse.builder()
                .courseId(course.getId())
                .courseCode(course.getCode())
                .courseName(course.getName())
                .numberOfPrequisiteCourses(prerequisiteCount)
                .hasCircularDependency(hasCircularDependency)
                .isPrequisiteForOtherCourses(isPrerequisiteForOthers)
                .departmentName(getDepartmentNameFromCourse(course))
                .build();
    }
    
    private CoursePrerequisiteDetailsResponse.CourseInfo buildCourseInfo(Course course) {
        return CoursePrerequisiteDetailsResponse.CourseInfo.builder()
                .courseId(course.getId())
                .courseCode(course.getCode())
                .courseName(course.getName())
                .creditsTheory(course.getCreditsTheory())
                .creditsPractical(course.getCreditsPractical())
                .departmentName(getDepartmentNameFromCourse(course))
                .courseType(course.getCourseType() != null ? course.getCourseType().toString() : null)
                .build();
    }
    
    private CoursePrerequisiteDetailsResponse.PrerequisiteCourseInfo buildPrerequisiteCourseInfo(Course course, boolean canBeRemoved) {
        return CoursePrerequisiteDetailsResponse.PrerequisiteCourseInfo.builder()
                .courseId(course.getId())
                .courseCode(course.getCode())
                .courseName(course.getName())
                .totalCredits(getTotalCredits(course))
                .canBeRemoved(canBeRemoved)
                .departmentName(getDepartmentNameFromCourse(course))
                .build();
    }
    
    private CoursePrerequisiteDetailsResponse.CourseOption buildCourseOption(Course course) {
        return CoursePrerequisiteDetailsResponse.CourseOption.builder()
                .courseId(course.getId())
                .courseCode(course.getCode())
                .courseName(course.getName())
                .departmentName(getDepartmentNameFromCourse(course))
                .totalCredits(getTotalCredits(course))
                .build();
    }
    
    private String getDepartmentNameFromCourse(Course course) {
        // Get all departments this course belongs to through program curriculums
        List<String> departmentNames = courseRepository.findDepartmentNamesByCourseId(course.getId());
        
        if (departmentNames.isEmpty()) {
            return "Khoa không xác định"; // Vietnamese localization for "Unknown Department"
        } else if (departmentNames.size() == 1) {
            return departmentNames.get(0);
        } else {
            // Multiple departments: join with " | " separator for display
            return String.join(" | ", departmentNames);
        }
    }
    
    private Integer getTotalCredits(Course course) {
        Integer theory = course.getCreditsTheory() != null ? course.getCreditsTheory() : 0;
        Integer practical = course.getCreditsPractical() != null ? course.getCreditsPractical() : 0;
        return theory + practical;
    }
    
    private boolean hasCircularDependencyIssues(Long courseId) {
        // Basic check for circular dependencies
        List<PrerequisiteCourse> prerequisites = prerequisiteCourseRepository.findByCourseId(courseId);
        
        for (PrerequisiteCourse prerequisite : prerequisites) {
            if (wouldCreateCircularDependency(prerequisite.getPrerequisiteCourse().getId(), courseId)) {
                return true;
            }
        }
        
        return false;
    }
    
    private boolean wouldCreateCircularDependency(Long courseId, Long prerequisiteCourseId) {
        // Check if adding prerequisiteCourseId as prerequisite to courseId would create a cycle
        return hasPrerequisiteRelationshipRecursive(prerequisiteCourseId, courseId, new HashSet<>());
    }
    
    private boolean hasPrerequisiteRelationshipRecursive(Long courseId, Long targetId, Set<Long> visited) {
        if (visited.contains(courseId)) {
            return false; // Avoid infinite loops
        }
        
        if (courseId.equals(targetId)) {
            return true;
        }
        
        visited.add(courseId);
        
        List<PrerequisiteCourse> prerequisites = prerequisiteCourseRepository.findByCourseId(courseId);
        for (PrerequisiteCourse prerequisite : prerequisites) {
            if (hasPrerequisiteRelationshipRecursive(prerequisite.getPrerequisiteCourse().getId(), targetId, visited)) {
                return true;
            }
        }
        
        return false;
    }
    
    private List<String> detectCircularDependencyWarnings(Long courseId) {
        List<String> warnings = new ArrayList<>();
        
        // Check for potential circular dependencies
        List<PrerequisiteCourse> prerequisites = prerequisiteCourseRepository.findByCourseId(courseId);
        for (PrerequisiteCourse prerequisite : prerequisites) {
            if (hasPrerequisiteRelationshipRecursive(prerequisite.getPrerequisiteCourse().getId(), courseId, new HashSet<>())) {
                warnings.add("Circular dependency detected with course: " + prerequisite.getPrerequisiteCourse().getCode());
            }
        }
        
        return warnings;
    }
}
