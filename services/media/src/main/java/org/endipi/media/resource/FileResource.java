package org.endipi.media.resource;

import lombok.RequiredArgsConstructor;
import org.endipi.media.service.FileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/files")
public class FileResource {
    private final FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<Boolean> uploadImage(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(fileService.uploadImage(file));
    }
}
