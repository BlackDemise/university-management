package org.endipi.academic.resource;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.endipi.academic.dto.request.MajorRequest;
import org.endipi.academic.dto.response.ApiResponse;
import org.endipi.academic.dto.response.MajorCurriculumResponse;
import org.endipi.academic.dto.response.MajorResponse;
import org.endipi.academic.service.MajorService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/major")
@RequiredArgsConstructor
public class MajorResource {
    private final MajorService majorService;

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        List<MajorResponse> majorResponses = majorService.findAll();

        ApiResponse<String, List<MajorResponse>> apiResponse = ApiResponse.<String, List<MajorResponse>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(majorResponses)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/all/page")
    public ResponseEntity<?> findAllWithPaging(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String sort,
            @RequestParam(required = false) String searchValue,
            @RequestParam(defaultValue = "name") String searchCriterion
    ) {
        Page<MajorResponse> response = majorService.findBySearchingCriterion(page, size, sort, searchValue, searchCriterion);

        ApiResponse<String, Page<MajorResponse>> apiResponse = ApiResponse.<String, Page<MajorResponse>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(response)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/all/summary/page")
    public ResponseEntity<?> findAllSummaryWithPaging(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String sort,
            @RequestParam(required = false) String searchValue,
            @RequestParam(defaultValue = "name") String searchCriterion
    ) {
        Page<MajorCurriculumResponse> response = majorService.findMajorCurriculumSummary(page, size, sort, searchValue, searchCriterion);

        ApiResponse<String, Page<MajorCurriculumResponse>> apiResponse = ApiResponse.<String, Page<MajorCurriculumResponse>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(response)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        MajorResponse majorResponse = majorService.findById(id);

        ApiResponse<String, MajorResponse> apiResponse = ApiResponse.<String, MajorResponse>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(majorResponse)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@Valid @RequestBody MajorRequest majorRequest) {
        MajorResponse majorResponse = majorService.saveWithRetry(majorRequest);

        ApiResponse<String, MajorResponse> apiResponse = ApiResponse.<String, MajorResponse>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(majorResponse)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        majorService.deleteById(id);

        ApiResponse<String, String> apiResponse = ApiResponse.<String, String>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    // S2S ENDPOINT -> no ApiResponse wrapper for clarity
    @GetMapping("/validate/{majorId}")
    public ResponseEntity<Boolean> validateMajor(@PathVariable Long majorId) {
        boolean isValid = majorService.validateMajor(majorId);
        return ResponseEntity.ok(isValid);
    }
}
