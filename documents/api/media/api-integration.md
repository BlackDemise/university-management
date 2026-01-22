# Media Service - API Integration Documentation

## Overview

The Media Service is a standalone storage service that handles file upload and retrieval. It integrates with Google
Cloud Storage for production deployments and supports local storage for development.

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             MEDIA SERVICE                                    │
│                              (Port 8006)                                     │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         GCS Resource                                 │    │
│  │   /api/v1/gcs/upload, /download, /signed-url, /image, /list         │    │
│  └─────────────────────────────────┬───────────────────────────────────┘    │
│                                    │                                         │
│  ┌─────────────────────────────────┼───────────────────────────────────┐    │
│  │                     GCS Storage Service                              │    │
│  └─────────────────────────────────┬───────────────────────────────────┘    │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
                                     ▼
                      ┌──────────────────────────┐
                      │   Google Cloud Storage   │
                      │                          │
                      │ Bucket: university-      │
                      │ management-files         │
                      └──────────────────────────┘
```

---

## Outbound Integrations

### 1. Google Cloud Storage

**Purpose:** Primary file storage for production environments

**Configuration:**

- Bucket: `university-management-files`
- Region: Configured per GCS project
- Authentication: Service account JSON credentials

**Operations:**
| Operation | GCS Method |
|-----------|------------|
| Upload | `BlobInfo.newBuilder().build()` + `storage.create()` |
| Download | `storage.get()` + `blob.downloadTo()` |
| Signed URL | `storage.signUrl()` with `SignUrlOption.withV4Signature()` |
| Delete | `storage.delete()` |
| List | `storage.list()` with `BlobListOption.prefix()` |

---

## Inbound Integrations (Other Services → Media Service)

### 1. User Service

**Consumer:** User Service (Avatar Management)  
**Integration Type:** Feign Client

| Endpoint Called                 | Purpose            |
|---------------------------------|--------------------|
| `POST /api/v1/gcs/upload`       | Upload user avatar |
| `DELETE /api/v1/gcs/{fileName}` | Delete old avatar  |

**Data Flow:**

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌───────────────┐
│   Frontend   │     │ User Service │     │Media Service │     │      GCS      │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘     └───────┬───────┘
       │                    │                    │                     │
       │ PUT /user/{id}/    │                    │                     │
       │ avatar             │                    │                     │
       │ (multipart)        │                    │                     │
       │───────────────────>│                    │                     │
       │                    │                    │                     │
       │                    │ POST /gcs/upload   │                     │
       │                    │ (multipart)        │                     │
       │                    │───────────────────>│                     │
       │                    │                    │                     │
       │                    │                    │ Upload to bucket    │
       │                    │                    │────────────────────>│
       │                    │                    │                     │
       │                    │                    │ Success             │
       │                    │                    │<────────────────────│
       │                    │                    │                     │
       │                    │ {fileName, fileUrl}│                     │
       │                    │<───────────────────│                     │
       │                    │                    │                     │
       │                    │ Update user.avatar │                     │
       │                    │ = fileUrl          │                     │
       │                    │                    │                     │
       │ 200 OK             │                    │                     │
       │ {avatarUrl}        │                    │                     │
       │<───────────────────│                    │                     │
```

---

## Service Dependencies

### Depends On

| Dependency               | Type  | Required  | Purpose                  |
|--------------------------|-------|-----------|--------------------------|
| **Config Server**        | HTTP  | Yes       | Configuration management |
| **Discovery (Eureka)**   | HTTP  | Yes       | Service registration     |
| **Google Cloud Storage** | HTTPS | Prod only | File storage             |

### Depended By

| Service          | Integration  | Purpose              |
|------------------|--------------|----------------------|
| **User Service** | Feign Client | Avatar upload/delete |

---

## Configuration

### Application Configuration

```yaml
# GCS Configuration
gcs:
  bucket-name: ${GCS_BUCKET_NAME:university-management-files}
  project-id: ${GCS_PROJECT_ID}
  credentials:
    path: ${GCS_CREDENTIALS_PATH:/etc/secrets/gcs-credentials.json}

# Local Storage (Development)
storage:
  local:
    enabled: ${LOCAL_STORAGE_ENABLED:false}
    path: ./uploads
```

### Environment Variables

| Variable                | Description                  | Required   |
|-------------------------|------------------------------|------------|
| `GCS_PROJECT_ID`        | Google Cloud project ID      | Yes (prod) |
| `GCS_BUCKET_NAME`       | GCS bucket name              | Yes (prod) |
| `GCS_CREDENTIALS_PATH`  | Path to service account JSON | Yes (prod) |
| `LOCAL_STORAGE_ENABLED` | Enable local storage mode    | No         |

---

## Error Handling

### GCS Errors

| Error Type              | Handling                       |
|-------------------------|--------------------------------|
| `StorageException`      | Log error, return 500          |
| `BlobNotFoundException` | Return 404                     |
| `AccessDeniedException` | Log security alert, return 403 |
| Timeout                 | Retry with exponential backoff |

### Client Error Responses

```json
{
  "code": 8500,
  "message": "Storage service unavailable",
  "result": null
}
```

---

## File Organization in GCS

```
university-management-files/
├── avatars/
│   ├── user_1_1703145600.jpg
│   ├── user_2_1703145700.png
│   └── ...
├── documents/
│   ├── course_syllabus_101.pdf
│   └── ...
└── exports/
    └── grades_export_2024.xlsx
```

### Naming Convention

- **Avatars:** `avatars/user_{userId}_{timestamp}.{ext}`
- **Documents:** `documents/{type}_{id}.{ext}`
- **Exports:** `exports/{type}_{date}.{ext}`

---

## Security Considerations

### GCS IAM Permissions

Required service account permissions:

- `storage.objects.create`
- `storage.objects.get`
- `storage.objects.delete`
- `storage.objects.list`

### Signed URL Security

- Default expiration: 15 minutes
- V4 signature algorithm
- HTTP method restriction (GET only for downloads)

### Service-Level Security

**Current State:** No security filter at service level  
**Protection:** API Gateway handles JWT validation

**Recommendation:** Consider adding service-level security for defense in depth.

---

## Monitoring

### Key Metrics

| Metric                 | Description               |
|------------------------|---------------------------|
| `media.upload.count`   | Total uploads             |
| `media.upload.size`    | Upload sizes distribution |
| `media.upload.errors`  | Upload failures           |
| `media.download.count` | Total downloads           |
| `gcs.latency`          | GCS operation latency     |

### Health Checks

| Endpoint               | Check            |
|------------------------|------------------|
| `/actuator/health`     | Service health   |
| `/actuator/health/gcs` | GCS connectivity |

---

## Deployment Considerations

### Docker Configuration

```yaml
media-service:
  environment:
    - GCS_PROJECT_ID=${GCS_PROJECT_ID}
    - GCS_BUCKET_NAME=${GCS_BUCKET_NAME}
    - GCS_CREDENTIALS_PATH=/etc/secrets/gcs-credentials.json
  volumes:
    - ./secrets/gcs-credentials.json:/etc/secrets/gcs-credentials.json:ro
```

### Development Mode

For local development without GCS:

1. Set `LOCAL_STORAGE_ENABLED=true`
2. Files stored in `./uploads` directory
3. URLs point to local file endpoints

---

## API Gateway Routes

The Gateway routes media requests to this service:

```yaml
- id: media-service
  uri: lb://media-service
  predicates:
    - Path=/api/v1/gcs/**, /api/v1/files/**
```

---

## Future Enhancements

1. **CDN Integration:** Add CloudFlare/Cloud CDN for static asset caching
2. **Image Processing:** Add thumbnail generation, resize capabilities
3. **Virus Scanning:** Integrate with ClamAV for upload scanning
4. **Quota Management:** Per-user storage quotas
5. **S3 Support:** Add AWS S3 as alternative storage backend
