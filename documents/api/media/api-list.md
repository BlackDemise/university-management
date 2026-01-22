# Media Service - API Documentation

## Overview

The Media Service handles file storage and retrieval, supporting Google Cloud Storage (GCS) for cloud deployment and
local filesystem for development.

- **Service Name:** `media-service`
- **Port:** `8006`
- **Base Path:** `/api/v1`
- **Database:** None (stateless file storage)

---

## Resources

### 1. GCS Resource

**Path:** `/api/v1/gcs`

#### Endpoints

| Method   | Endpoint                 | Description              | Auth Required |
|----------|--------------------------|--------------------------|---------------|
| `POST`   | `/upload`                | Upload file to GCS       | Yes           |
| `GET`    | `/download/{fileName}`   | Download file from GCS   | Yes           |
| `GET`    | `/signed-url/{fileName}` | Get signed URL for file  | Yes           |
| `DELETE` | `/{fileName}`            | Delete file from GCS     | Yes           |
| `GET`    | `/image/{fileName}`      | Get image directly       | Yes           |
| `GET`    | `/list`                  | List all files in bucket | Yes           |

---

#### POST `/api/v1/gcs/upload`

Upload a file to Google Cloud Storage.

**Request:**

- Content-Type: `multipart/form-data`

| Parameter | Type          | Required | Description                    |
|-----------|---------------|----------|--------------------------------|
| `file`    | MultipartFile | Yes      | File to upload                 |
| `folder`  | String        | No       | Subfolder path (default: root) |

**Response:**

```json
{
  "code": 0,
  "message": "Upload successful",
  "result": {
    "fileName": "avatars/user_123_1703145600.jpg",
    "fileUrl": "https://storage.googleapis.com/university-management-files/avatars/user_123_1703145600.jpg",
    "contentType": "image/jpeg",
    "size": 102400
  }
}
```

**Error Responses:**

| Code | HTTP Status | Message                        |
|------|-------------|--------------------------------|
| 8001 | 400         | Empty file provided            |
| 8002 | 400         | File size exceeds limit (10MB) |
| 8003 | 400         | Invalid file type              |
| 8500 | 500         | Storage service unavailable    |

---

#### GET `/api/v1/gcs/download/{fileName}`

Download a file from GCS.

**Path Parameters:**

| Parameter  | Type   | Required | Description              |
|------------|--------|----------|--------------------------|
| `fileName` | String | Yes      | Full file path in bucket |

**Response:**

- Content-Type: Based on file type
- Content-Disposition: `attachment; filename="original_name.ext"`
- Body: Binary file content

**Error Responses:**

| Code | HTTP Status | Message                     |
|------|-------------|-----------------------------|
| 8004 | 404         | File not found              |
| 8500 | 500         | Storage service unavailable |

---

#### GET `/api/v1/gcs/signed-url/{fileName}`

Generate a signed URL for temporary file access.

**Path Parameters:**

| Parameter  | Type   | Required | Description              |
|------------|--------|----------|--------------------------|
| `fileName` | String | Yes      | Full file path in bucket |

**Query Parameters:**

| Parameter  | Type    | Required | Default | Description             |
|------------|---------|----------|---------|-------------------------|
| `duration` | Integer | No       | 15      | URL validity in minutes |

**Response:**

```json
{
  "code": 0,
  "message": "Signed URL generated",
  "result": {
    "signedUrl": "https://storage.googleapis.com/university-management-files/avatars/user_123.jpg?X-Goog-Algorithm=...",
    "expiresAt": "2024-01-15T10:30:00Z"
  }
}
```

---

#### DELETE `/api/v1/gcs/{fileName}`

Delete a file from GCS.

**Path Parameters:**

| Parameter  | Type   | Required | Description              |
|------------|--------|----------|--------------------------|
| `fileName` | String | Yes      | Full file path in bucket |

**Response:**

```json
{
  "code": 0,
  "message": "File deleted successfully",
  "result": null
}
```

**Error Responses:**

| Code | HTTP Status | Message        |
|------|-------------|----------------|
| 8004 | 404         | File not found |

---

#### GET `/api/v1/gcs/image/{fileName}`

Get image content directly (for inline display).

**Path Parameters:**

| Parameter  | Type   | Required | Description              |
|------------|--------|----------|--------------------------|
| `fileName` | String | Yes      | Full file path in bucket |

**Response:**

- Content-Type: `image/jpeg`, `image/png`, etc.
- Content-Disposition: `inline`
- Body: Binary image content

---

#### GET `/api/v1/gcs/list`

List all files in the GCS bucket.

**Query Parameters:**

| Parameter    | Type    | Required | Default | Description             |
|--------------|---------|----------|---------|-------------------------|
| `prefix`     | String  | No       | ""      | Filter by path prefix   |
| `maxResults` | Integer | No       | 100     | Maximum files to return |

**Response:**

```json
{
  "code": 0,
  "message": "Files retrieved",
  "result": {
    "files": [
      {
        "name": "avatars/user_123.jpg",
        "size": 102400,
        "contentType": "image/jpeg",
        "createdAt": "2024-01-15T09:00:00Z",
        "updatedAt": "2024-01-15T09:00:00Z"
      }
    ],
    "totalCount": 1
  }
}
```

---

### 2. Local File Resource

**Path:** `/api/v1/files`

#### Endpoints

| Method | Endpoint  | Description                  | Auth Required |
|--------|-----------|------------------------------|---------------|
| `POST` | `/upload` | Upload file to local storage | Yes           |

---

#### POST `/api/v1/files/upload`

Upload a file to local storage (development only).

**Request:**

- Content-Type: `multipart/form-data`

| Parameter | Type          | Required | Description    |
|-----------|---------------|----------|----------------|
| `file`    | MultipartFile | Yes      | File to upload |

**Response:**

```json
{
  "code": 0,
  "message": "Upload successful",
  "result": {
    "fileName": "uploads/1703145600_original_name.jpg",
    "filePath": "/app/uploads/1703145600_original_name.jpg"
  }
}
```

---

## DTOs

### GcsUploadResponse

```json
{
  "fileName": "string",
  "fileUrl": "string",
  "contentType": "string",
  "size": 0
}
```

### SignedUrlResponse

```json
{
  "signedUrl": "string",
  "expiresAt": "2024-01-15T10:30:00Z"
}
```

### FileListResponse

```json
{
  "files": [
    {
      "name": "string",
      "size": 0,
      "contentType": "string",
      "createdAt": "2024-01-15T09:00:00Z",
      "updatedAt": "2024-01-15T09:00:00Z"
    }
  ],
  "totalCount": 0
}
```

### LocalUploadResponse

```json
{
  "fileName": "string",
  "filePath": "string"
}
```

---

## Error Codes

| Code | HTTP Status | Message                     | Description                           |
|------|-------------|-----------------------------|---------------------------------------|
| 8001 | 400         | Empty file provided         | File parameter is empty               |
| 8002 | 400         | File size exceeds limit     | Max 10MB allowed                      |
| 8003 | 400         | Invalid file type           | Unsupported MIME type                 |
| 8004 | 404         | File not found              | File doesn't exist in storage         |
| 8005 | 400         | Invalid file name           | File name contains invalid characters |
| 8500 | 500         | Storage service unavailable | GCS connection error                  |

---

## Supported File Types

### Images

- `image/jpeg`
- `image/png`
- `image/gif`
- `image/webp`

### Documents

- `application/pdf`
- `application/msword`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- `application/vnd.ms-excel`
- `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

---

## Configuration

### GCS Configuration

```yaml
gcs:
  bucket-name: university-management-files
  project-id: ${GCS_PROJECT_ID}
  credentials-path: ${GCS_CREDENTIALS_PATH}
  max-file-size: 10MB
  signed-url-duration: 15  # minutes
```

### Local Storage Configuration

```yaml
storage:
  local:
    upload-dir: ./uploads
    max-file-size: 10MB
```

---

## Business Rules

1. **File Size Limit:** Maximum 10MB per file
2. **File Naming:** Files are renamed with timestamp prefix to avoid conflicts
3. **Folder Organization:** Avatar files go to `avatars/` folder
4. **Signed URLs:** Default 15-minute expiration
5. **Content Type Detection:** Automatically detected from file content

---

## Security Notes

1. **No Security Filter:** Media Service currently has no JWT validation configured at the service level
2. **Gateway Protection:** All requests go through API Gateway which handles authentication
3. **GCS IAM:** Service account requires `storage.objects.create`, `storage.objects.get`, `storage.objects.delete`
   permissions
