package org.endipi.media.service.impl;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import lombok.RequiredArgsConstructor;
import org.endipi.media.service.GCSService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class GCSServiceImpl implements GCSService {
    private final Storage storage;

    @Value("${spring.cloud.gcp.storage.bucket}")
    private String bucketName;

    @Override
    public boolean uploadFile(String fileName, byte[] content, String contentType) {
        try {
            BlobId blobId = BlobId.of(bucketName, fileName);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                    .setContentType(contentType)
                    .build();
            storage.create(blobInfo, content);

            return true;
        } catch (Exception e) {
            e.printStackTrace(System.err);
            return false;
        }
    }

    @Override
    public byte[] downloadFile(String fileName) {
        Blob blob = storage.get(BlobId.of(bucketName, fileName));
        return blob.getContent();
    }

    @Override
    public boolean deleteFile(String fileName) {
        return storage.delete(BlobId.of(bucketName, fileName));
    }

    @Override
    public byte[] getImage(String bucketName, String fileName) {
        if (bucketName == null ) {
            bucketName = this.bucketName; // Use the default bucket if none provided
        }

        BlobId blobId = BlobId.of(bucketName, fileName);
        Blob blob = storage.get(blobId);
        return blob.getContent();
    }

    @Override
    public String getAllFiles(String bucketName) {
        StringBuilder fileList = new StringBuilder();
        storage.list(bucketName).iterateAll().forEach(blob -> {
            fileList.append(blob.getName()).append("\n");
        });
        return fileList.toString();
    }

    @Override
    public String generateSignedUrl(String fileName) {
        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, fileName).build();

        URL url = storage.signUrl(
                blobInfo,
                15, TimeUnit.MINUTES, // Expires in 15 minutes
                Storage.SignUrlOption.withV4Signature()
        );

        return url.toString();
    }
}
