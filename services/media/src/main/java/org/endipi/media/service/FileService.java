package org.endipi.media.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    boolean uploadImage(MultipartFile file);
}
