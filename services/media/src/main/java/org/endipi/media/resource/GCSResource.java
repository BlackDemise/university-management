package org.endipi.media.resource;

import com.google.cloud.storage.StorageException;
import lombok.RequiredArgsConstructor;
import org.endipi.media.service.GCSService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/gcs")
public class GCSResource {
    private final GCSService gcsService;

    /**
     * Upload a file to GCS
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadFile(@RequestPart("file") MultipartFile file) {
        try {
            boolean uploaded = gcsService.uploadFile(file.getOriginalFilename(),
                    file.getBytes(),
                    file.getContentType());
            
            if (uploaded) {
                // Generate signed URL for the uploaded file
                String signedUrl = gcsService.generateSignedUrl(file.getOriginalFilename());
                return ResponseEntity.ok(signedUrl);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Failed to upload file to GCS");
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing file: " + e.getMessage());
        }
    }

    /**
     * Download a file from GCS
     */
    @GetMapping("/download/{fileName}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable String fileName) {
        try {
            byte[] content = gcsService.downloadFile(fileName);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(content);
        } catch (StorageException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
    }

    /**
     * Generate a signed URL for a file in GCS
     * @param fileName
     * @return
     */
    @GetMapping("/signed-url/{fileName}")
    public ResponseEntity<String> getSignedUrl(@PathVariable String fileName) {
        try {
            String signedUrl = gcsService.generateSignedUrl(fileName);
            return ResponseEntity.ok(signedUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating signed URL: " + e.getMessage());
        }
    }

    /**
     * Delete a file from GCS
     */
    @DeleteMapping("/delete/{fileName}")
    public ResponseEntity<String> deleteFile(@PathVariable String fileName) {
        boolean deleted = gcsService.deleteFile(fileName);
        if (deleted) {
            return ResponseEntity.ok("File deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("File not found or could not be deleted.");
        }
    }

    @GetMapping("/image")
    public ResponseEntity<byte[]> getImage(@RequestParam String fileName) {
        return ResponseEntity.ok(gcsService.getImage(null, fileName));
    }

    @GetMapping("/bucket/all")
    public ResponseEntity<String> getAllFiles() {
        return ResponseEntity.ok(gcsService.getAllFiles(null));
    }
}
