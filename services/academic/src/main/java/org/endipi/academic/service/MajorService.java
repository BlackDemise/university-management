package org.endipi.academic.service;

import org.endipi.academic.dto.request.MajorRequest;
import org.endipi.academic.dto.response.MajorResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface MajorService {
    List<MajorResponse> findAll();

    MajorResponse findById(Long id);

    MajorResponse saveWithRetry(MajorRequest majorRequest);

    void deleteById(Long id);

    boolean validateMajor(Long majorId);

    Page<MajorResponse> findBySearchingCriterion(int page, int size, String sort, String searchValue, String searchCriterion);
}
