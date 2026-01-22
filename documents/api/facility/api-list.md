# Facility Service API Documentation

## Overview

The Facility Service manages classroom and room resources for the university. It provides CRUD operations for classrooms
and service-to-service endpoints for validation and batch retrieval.

**Base URL:** `/api/v1/classroom` (via Gateway at port 8222)  
**Direct URL:** `http://localhost:8003/api/v1/classroom`  
**Service Port:** 8003

---

## Endpoints

### Classroom Management

#### 1. Get All Classrooms

| Property           | Value                   |
|--------------------|-------------------------|
| **Method**         | `GET`                   |
| **Endpoint**       | `/api/v1/classroom/all` |
| **Authentication** | Required                |
| **Authorization**  | ADMIN                   |

**Response (200 OK):**

```json
{
  "timestamp": 1705920000000,
  "statusCode": 200,
  "message": "Success",
  "result": [
    {
      "id": 1,
      "roomNumber": "A101",
      "building": "Building A",
      "capacity": 50,
      "equipment": "Projector, Whiteboard, AC",
      "classroomType": "Phòng học lý thuyết"
    }
  ]
}
```

---

#### 2. Get Classrooms (Paginated)

| Property           | Value               |
|--------------------|---------------------|
| **Method**         | `GET`               |
| **Endpoint**       | `/api/v1/classroom` |
| **Authentication** | Required            |
| **Authorization**  | ADMIN               |

**Query Parameters:**

| Parameter         | Type   | Default  | Description                            |
|-------------------|--------|----------|----------------------------------------|
| `page`            | int    | 0        | Page number (0-indexed)                |
| `size`            | int    | 10       | Items per page                         |
| `sort`            | string | "id,asc" | Sort field and direction               |
| `searchValue`     | string | ""       | Search term                            |
| `searchCriterion` | string | ""       | Field to search (roomNumber, building) |

**Response (200 OK):**

```json
{
  "timestamp": 1705920000000,
  "statusCode": 200,
  "message": "Success",
  "result": {
    "content": [
      {
        "id": 1,
        "roomNumber": "A101",
        "building": "Building A",
        "capacity": 50,
        "equipment": "Projector, Whiteboard",
        "classroomType": "Phòng học lý thuyết"
      }
    ],
    "totalElements": 25,
    "totalPages": 3,
    "number": 0,
    "size": 10
  }
}
```

---

#### 3. Get Classroom by ID

| Property           | Value                    |
|--------------------|--------------------------|
| **Method**         | `GET`                    |
| **Endpoint**       | `/api/v1/classroom/{id}` |
| **Authentication** | Required                 |
| **Authorization**  | ADMIN                    |

**Path Parameters:**

| Parameter | Type | Description  |
|-----------|------|--------------|
| `id`      | Long | Classroom ID |

**Response (200 OK):**

```json
{
  "timestamp": 1705920000000,
  "statusCode": 200,
  "message": "Success",
  "result": {
    "id": 1,
    "roomNumber": "A101",
    "building": "Building A",
    "capacity": 50,
    "equipment": "Projector, Whiteboard, AC",
    "classroomType": "Phòng học lý thuyết"
  }
}
```

---

#### 4. Create/Update Classroom

| Property           | Value               |
|--------------------|---------------------|
| **Method**         | `POST`              |
| **Endpoint**       | `/api/v1/classroom` |
| **Authentication** | Required            |
| **Authorization**  | ADMIN               |

**Request Body:**

```json
{
  "id": null,
  "roomNumber": "A101",
  "building": "Building A",
  "capacity": 50,
  "equipment": "Projector, Whiteboard, AC",
  "classroomType": "LECTURE_HALL"
}
```

| Field           | Type   | Required | Description                    |
|-----------------|--------|----------|--------------------------------|
| `id`            | Long   | No       | Null for create, ID for update |
| `roomNumber`    | string | Yes      | Room number (max 20 chars)     |
| `building`      | string | No       | Building name (max 100 chars)  |
| `capacity`      | int    | No       | Room capacity                  |
| `equipment`     | string | No       | Equipment list (max 500 chars) |
| `classroomType` | string | Yes      | LECTURE_HALL or LAB            |

**Response (201 Created / 200 OK):**

```json
{
  "timestamp": 1705920000000,
  "statusCode": 201,
  "message": "Classroom created successfully",
  "result": {
    "id": 1,
    "roomNumber": "A101",
    "building": "Building A",
    "capacity": 50,
    "equipment": "Projector, Whiteboard, AC",
    "classroomType": "Phòng học lý thuyết"
  }
}
```

---

#### 5. Delete Classroom

| Property           | Value                    |
|--------------------|--------------------------|
| **Method**         | `DELETE`                 |
| **Endpoint**       | `/api/v1/classroom/{id}` |
| **Authentication** | Required                 |
| **Authorization**  | ADMIN                    |

**Response (200 OK):**

```json
{
  "timestamp": 1705920000000,
  "statusCode": 200,
  "message": "Classroom deleted successfully"
}
```

---

### Service-to-Service (S2S) Endpoints

These endpoints are used internally by other services (mainly Assessment Service).

#### 1. Validate Classroom

| Property     | Value                                      |
|--------------|--------------------------------------------|
| **Method**   | `GET`                                      |
| **Endpoint** | `/api/v1/classroom/validate/{classroomId}` |
| **Usage**    | Service-to-Service                         |

**Response:**

```json
{
  "isExists": true,
  "classroomType": "Phòng học lý thuyết"
}
```

| Field           | Type    | Description                                      |
|-----------------|---------|--------------------------------------------------|
| `isExists`      | boolean | Whether classroom exists                         |
| `classroomType` | string  | Classroom type display name (null if not exists) |

---

#### 2. Batch Get Classroom Details

| Property     | Value                                 |
|--------------|---------------------------------------|
| **Method**   | `GET`                                 |
| **Endpoint** | `/api/v1/classroom/s2s/batch-details` |
| **Usage**    | Service-to-Service                    |

**Query Parameters:**

| Parameter      | Type      | Description                   |
|----------------|-----------|-------------------------------|
| `classroomIds` | Set<Long> | Comma-separated classroom IDs |

**Response:**

```json
{
  "1": {
    "id": 1,
    "name": "A101",
    "classroomType": "Phòng học lý thuyết",
    "capacity": 50
  },
  "2": {
    "id": 2,
    "name": "LAB-01",
    "classroomType": "Phòng học thực hành",
    "capacity": 30
  }
}
```

---

#### 3. Get All Classrooms with Details

| Property     | Value                       |
|--------------|-----------------------------|
| **Method**   | `GET`                       |
| **Endpoint** | `/api/v1/classroom/s2s/all` |
| **Usage**    | Service-to-Service          |

**Response:**

```json
[
  {
    "id": 1,
    "name": "A101",
    "classroomType": "Phòng học lý thuyết",
    "capacity": 50
  }
]
```

---

## Data Models

### ClassroomRequest

```json
{
  "id": "number | null",
  "roomNumber": "string",
  "building": "string",
  "capacity": "number",
  "equipment": "string",
  "classroomType": "LECTURE_HALL | LAB"
}
```

### ClassroomResponse

```json
{
  "id": "number",
  "roomNumber": "string",
  "building": "string",
  "capacity": "number",
  "equipment": "string",
  "classroomType": "string (Vietnamese display name)"
}
```

### ClassroomDetailsResponse (S2S)

```json
{
  "id": "number",
  "name": "string (roomNumber)",
  "classroomType": "string (Vietnamese display name)",
  "capacity": "number"
}
```

### ClassroomValidationResponse (S2S)

```json
{
  "isExists": "boolean",
  "classroomType": "string | null"
}
```

---

## Enums

### ClassroomType

| Value          | Vietnamese Display  | Description                             |
|----------------|---------------------|-----------------------------------------|
| `LECTURE_HALL` | Phòng học lý thuyết | Lecture rooms for theory classes        |
| `LAB`          | Phòng học thực hành | Laboratory rooms for practical sessions |

---

## Error Codes

| Code                  | HTTP Status | Message                    |
|-----------------------|-------------|----------------------------|
| `CLASSROOM_NOT_FOUND` | 404         | Không tìm thấy phòng học!  |
| `CLASSROOM_EXISTS`    | 409         | Room number already exists |
| `VALIDATION_ERROR`    | 400         | Invalid input data         |
| `INTERNAL_ERROR`      | 500         | Internal server error      |

---

## Search Criteria

The following fields can be used as `searchCriterion`:

| Criterion    | Description                                               |
|--------------|-----------------------------------------------------------|
| `roomNumber` | Search by room number (case-insensitive, partial match)   |
| `building`   | Search by building name (case-insensitive, partial match) |

**Example:**

```
GET /api/v1/classroom?searchCriterion=roomNumber&searchValue=A10
```

---

## Business Rules

1. **Room Number Uniqueness:** Room numbers must be unique within the building
2. **Optimistic Locking:** Update operations use optimistic locking with retry (up to 3 attempts) to handle concurrent
   modifications
3. **Classroom Type:** Must be either `LECTURE_HALL` or `LAB`
