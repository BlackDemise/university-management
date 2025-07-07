package org.endipi.media.service;

public interface GCSService {
    boolean uploadFile(String fileName, byte[] content, String contentType);
    byte[] downloadFile(String fileName);
    boolean deleteFile(String fileName);
    byte[] getImage(String bucketName, String fileName);
    String getAllFiles(String bucketName);
    String generateSignedUrl(String fileName);
}
