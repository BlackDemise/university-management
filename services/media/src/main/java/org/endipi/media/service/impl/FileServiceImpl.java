package org.endipi.media.service.impl;

import org.endipi.media.service.FileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {
    @Value("${image-upload-dir}")
    private String imageUploadDirectory;

    @Override
    public boolean uploadImage(MultipartFile file) {
        if (file.isEmpty()) {
            return false;
        }

        try {
            // Ensure folder exists
            File directory = new File(imageUploadDirectory);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Save file
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(imageUploadDirectory, fileName);
            Files.write(filePath, file.getBytes());

            return true;

        } catch (IOException e) {
            return false;
        }
    }
}
