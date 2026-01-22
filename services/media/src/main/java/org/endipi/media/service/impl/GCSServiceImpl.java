package org.endipi.media.service.impl;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.endipi.media.service.GCSService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Slf4j
public class GCSServiceImpl implements GCSService {

    @Value("${local-storage.base-path:uploads}")
    private String basePath;

    @Value("${local-storage.base-url:http://localhost:8006/api/v1/gcs/files}")
    private String baseUrl;

    @PostConstruct
    public void init() {
        try {
            Path uploadDir = Paths.get(basePath);
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
                log.info("Created upload directory: {}", uploadDir.toAbsolutePath());
            }
        } catch (IOException e) {
            log.error("Failed to create upload directory: {}", e.getMessage());
        }
    }

    @Override
    public boolean uploadFile(String fileName, byte[] content, String contentType) {
        try {
            Path filePath = Paths.get(basePath, fileName);
            
            // Create parent directories if they don't exist
            Files.createDirectories(filePath.getParent());
            
            Files.write(filePath, content);
            log.info("File uploaded successfully: {}", filePath.toAbsolutePath());
            return true;
        } catch (IOException e) {
            log.error("Failed to upload file {}: {}", fileName, e.getMessage());
            return false;
        }
    }

    @Override
    public byte[] downloadFile(String fileName) {
        try {
            Path filePath = Paths.get(basePath, fileName);
            if (!Files.exists(filePath)) {
                log.warn("File not found: {}", filePath.toAbsolutePath());
                return null;
            }
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            log.error("Failed to download file {}: {}", fileName, e.getMessage());
            return null;
        }
    }

    @Override
    public boolean deleteFile(String fileName) {
        try {
            Path filePath = Paths.get(basePath, fileName);
            boolean deleted = Files.deleteIfExists(filePath);
            if (deleted) {
                log.info("File deleted successfully: {}", filePath.toAbsolutePath());
            } else {
                log.warn("File not found for deletion: {}", filePath.toAbsolutePath());
            }
            return deleted;
        } catch (IOException e) {
            log.error("Failed to delete file {}: {}", fileName, e.getMessage());
            return false;
        }
    }

    @Override
    public byte[] getImage(String bucketName, String fileName) {
        // bucketName parameter ignored for local storage
        return downloadFile(fileName);
    }

    @Override
    public String getAllFiles(String bucketName) {
        // bucketName parameter ignored for local storage
        try (Stream<Path> paths = Files.walk(Paths.get(basePath))) {
            return paths
                    .filter(Files::isRegularFile)
                    .map(path -> Paths.get(basePath).relativize(path).toString())
                    .collect(Collectors.joining("\n"));
        } catch (IOException e) {
            log.error("Failed to list files: {}", e.getMessage());
            return "";
        }
    }

    @Override
    public String generateSignedUrl(String fileName) {
        // For local storage, return a direct URL to the file serving endpoint
        return baseUrl + "/" + fileName;
    }
}
