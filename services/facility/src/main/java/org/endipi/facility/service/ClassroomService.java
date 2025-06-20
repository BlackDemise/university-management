package org.endipi.facility.service;

import org.endipi.facility.dto.request.ClassroomRequest;
import org.endipi.facility.dto.response.ClassroomResponse;

import java.util.List;

public interface ClassroomService {
    List<ClassroomResponse> findAll();

    ClassroomResponse findById(Long id);

    ClassroomResponse saveWithRetry(ClassroomRequest classroomRequest);

    void deleteById(Long id);
}
