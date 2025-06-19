package org.endipi.academic.resource;

import lombok.RequiredArgsConstructor;
import org.endipi.academic.dto.request.ProgramCurriculumRequest;
import org.endipi.academic.dto.response.ApiResponse;
import org.endipi.academic.dto.response.ProgramCurriculumResponse;
import org.endipi.academic.service.ProgramCurriculumService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/program-curriculum")
public class ProgramCurriculumResource {
    private final ProgramCurriculumService programCurriculumService;

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        List<ProgramCurriculumResponse> programCurriculumResponses = programCurriculumService.findAll();

        ApiResponse<String, List<ProgramCurriculumResponse>> apiResponse = ApiResponse.<String, List<ProgramCurriculumResponse>>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(programCurriculumResponses)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        ProgramCurriculumResponse programCurriculumResponse = programCurriculumService.findById(id);

        ApiResponse<String, ProgramCurriculumResponse> apiResponse = ApiResponse.<String, ProgramCurriculumResponse>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(programCurriculumResponse)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody ProgramCurriculumRequest programCurriculumRequest) {
        ProgramCurriculumResponse programCurriculumResponse = programCurriculumService.saveWithRetry(programCurriculumRequest);

        ApiResponse<String, ProgramCurriculumResponse> apiResponse = ApiResponse.<String, ProgramCurriculumResponse>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .result(programCurriculumResponse)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/{programCurriculumId}")
    public ResponseEntity<?> deleteById(@PathVariable Long programCurriculumId) {
        programCurriculumService.deleteById(programCurriculumId);

        ApiResponse<String, Void> apiResponse = ApiResponse.<String, Void>builder()
                .timestamp(System.currentTimeMillis())
                .statusCode(HttpStatus.OK.value())
                .message("OK")
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}