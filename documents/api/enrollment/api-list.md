# Enrollment Service API Documentation

## Overview

The Enrollment Service manages course enrollment operations including semesters, course offerings, and student course
registrations.

**Base URL:** `/api/v1/` (via Gateway at port 8222)  
**Direct URL:** `http://localhost:8004/api/v1/`  
**Service Port:** 8004

---

## Endpoints

### Semester Management

**Base Path:** `/api/v1/semester`

#### 1. Get All Semesters

| Property           | Value                  |
|--------------------|------------------------|
| **Method**         | `GET`                  |
| **Endpoint**       | `/api/v1/semester/all` |
| **Authentication** | Required               |
| **Authorization**  | ADMIN                  |

**Response (200 OK):**

```json
{
  "timestamp": 1705920000000,
  "statusCode": 200,
  "message": "Success",
  "result": [
    {
      "id": 1,
      "name": "Học kỳ 1 - 2024-2025",
      "startDate": "2024-09-01",
      "endDate": "2025-01-15"
    }
  ]
}
```

---

#### 2. Get Semesters (Paginated)

| Property           | Value              |
|--------------------|--------------------|
| **Method**         | `GET`              |
| **Endpoint**       | `/api/v1/semester` |
| **Authentication** | Required           |
| **Authorization**  | ADMIN              |

**Query Parameters:**

| Parameter         | Type   | Default  | Description     |
|-------------------|--------|----------|-----------------|
| `page`            | int    | 0        | Page number     |
| `size`            | int    | 10       | Items per page  |
| `sort`            | string | "id,asc" | Sort field      |
| `searchValue`     | string | ""       | Search term     |
| `searchCriterion` | string | ""       | Field to search |

---

#### 3. Get Semester by ID

| Property           | Value                   |
|--------------------|-------------------------|
| **Method**         | `GET`                   |
| **Endpoint**       | `/api/v1/semester/{id}` |
| **Authentication** | Required                |
| **Authorization**  | ADMIN                   |

---

#### 4. Create/Update Semester

| Property           | Value              |
|--------------------|--------------------|
| **Method**         | `POST`             |
| **Endpoint**       | `/api/v1/semester` |
| **Authentication** | Required           |
| **Authorization**  | ADMIN              |

**Request Body:**

```json
{
  "id": null,
  "name": "Học kỳ 1 - 2024-2025",
  "startDate": "2024-09-01",
  "endDate": "2025-01-15"
}
```

| Field       | Type   | Required | Description        |
|-------------|--------|----------|--------------------|
| `id`        | Long   | No       | Null for create    |
| `name`      | string | Yes      | Semester name      |
| `startDate` | string | Yes      | Format: yyyy-MM-dd |
| `endDate`   | string | Yes      | Format: yyyy-MM-dd |

---

#### 5. Delete Semester

| Property           | Value                   |
|--------------------|-------------------------|
| **Method**         | `DELETE`                |
| **Endpoint**       | `/api/v1/semester/{id}` |
| **Authentication** | Required                |
| **Authorization**  | ADMIN                   |

---

### Course Offering Management

**Base Path:** `/api/v1/course-offering`

#### 1. Get All Course Offerings

| Property           | Value                         |
|--------------------|-------------------------------|
| **Method**         | `GET`                         |
| **Endpoint**       | `/api/v1/course-offering/all` |
| **Authentication** | Required                      |
| **Authorization**  | ADMIN                         |

**Response (200 OK):**

```json
{
  "result": [
    {
      "id": 1,
      "maxStudents": 50,
      "currentStudents": 25,
      "openTime": "2024-08-01T08:00:00",
      "closeTime": "2024-08-15T23:59:59",
      "semesterResponse": {
        "id": 1,
        "name": "Học kỳ 1 - 2024-2025",
        "startDate": "2024-09-01",
        "endDate": "2025-01-15"
      },
      "courseResponse": {
        "id": 1,
        "courseCode": "CS101",
        "name": "Nhập môn lập trình",
        "creditsTheory": 2,
        "creditsPractical": 1
      },
      "teacherResponse": {
        "id": 1,
        "fullName": "Nguyễn Văn A",
        "teacherCode": "GV001"
      }
    }
  ]
}
```

---

#### 2. Get Course Offerings (Paginated)

| Property           | Value                     |
|--------------------|---------------------------|
| **Method**         | `GET`                     |
| **Endpoint**       | `/api/v1/course-offering` |
| **Authentication** | Required                  |
| **Authorization**  | ADMIN                     |

---

#### 3. Create/Update Course Offering

| Property           | Value                     |
|--------------------|---------------------------|
| **Method**         | `POST`                    |
| **Endpoint**       | `/api/v1/course-offering` |
| **Authentication** | Required                  |
| **Authorization**  | ADMIN                     |

**Request Body:**

```json
{
  "id": null,
  "maxStudents": 50,
  "currentStudents": 0,
  "openTime": "2024-08-01T08:00:00",
  "closeTime": "2024-08-15T23:59:59",
  "courseId": 1,
  "semesterId": 1,
  "teacherId": 1
}
```

| Field             | Type     | Required | Description                    |
|-------------------|----------|----------|--------------------------------|
| `id`              | Long     | No       | Null for create                |
| `maxStudents`     | int      | Yes      | Maximum enrollment             |
| `currentStudents` | int      | No       | Current enrollment (default 0) |
| `openTime`        | datetime | Yes      | Registration open time         |
| `closeTime`       | datetime | Yes      | Registration close time        |
| `courseId`        | Long     | Yes      | Course reference               |
| `semesterId`      | Long     | Yes      | Semester reference             |
| `teacherId`       | Long     | Yes      | Teacher reference              |

---

#### 4. S2S Endpoints

| Method | Endpoint                                              | Response                                   |
|--------|-------------------------------------------------------|--------------------------------------------|
| `GET`  | `/api/v1/course-offering/{id}/validate`               | `Boolean`                                  |
| `GET`  | `/api/v1/course-offering/s2s/batch-details?ids=1,2,3` | `Map<Long, CourseOfferingDetailsResponse>` |
| `GET`  | `/api/v1/course-offering/s2s/all`                     | `List<CourseOfferingDetailsResponse>`      |

---

### Course Registration Management

**Base Path:** `/api/v1/course-registration`

#### 1. Get All Registrations

| Property           | Value                             |
|--------------------|-----------------------------------|
| **Method**         | `GET`                             |
| **Endpoint**       | `/api/v1/course-registration/all` |
| **Authentication** | Required                          |
| **Authorization**  | ADMIN                             |

---

#### 2. Get Registrations Summary (Paginated)

| Property           | Value                                 |
|--------------------|---------------------------------------|
| **Method**         | `GET`                                 |
| **Endpoint**       | `/api/v1/course-registration/summary` |
| **Authentication** | Required                              |
| **Authorization**  | ADMIN                                 |

**Response:**

```json
{
  "result": {
    "content": [
      {
        "courseOfferingId": 1,
        "courseId": 1,
        "courseCode": "CS101",
        "courseName": "Nhập môn lập trình",
        "semesterName": "Học kỳ 1 - 2024-2025",
        "teacherId": 1,
        "teacherName": "Nguyễn Văn A",
        "maxStudents": 50,
        "currentStudents": 25,
        "registrationStatus": "REGISTERED"
      }
    ]
  }
}
```

---

#### 3. Create/Update Registration

| Property           | Value                         |
|--------------------|-------------------------------|
| **Method**         | `POST`                        |
| **Endpoint**       | `/api/v1/course-registration` |
| **Authentication** | Required                      |
| **Authorization**  | ADMIN                         |

**Request Body:**

```json
{
  "id": null,
  "registrationDate": "2024-08-05T10:30:00",
  "courseRegistrationStatus": "REGISTERED",
  "studentId": 1,
  "courseOfferingId": 1
}
```

| Field                      | Type     | Required | Description                       |
|----------------------------|----------|----------|-----------------------------------|
| `id`                       | Long     | No       | Null for create                   |
| `registrationDate`         | datetime | Yes      | When registered                   |
| `courseRegistrationStatus` | string   | Yes      | REGISTERED, PROCESSING, CANCELLED |
| `studentId`                | Long     | Yes      | Student reference                 |
| `courseOfferingId`         | Long     | Yes      | Course offering reference         |

---

#### 4. Get Registrations by Course Offering

| Property           | Value                                                            |
|--------------------|------------------------------------------------------------------|
| **Method**         | `GET`                                                            |
| **Endpoint**       | `/api/v1/course-registration/course-offering/{courseOfferingId}` |
| **Authentication** | Required                                                         |
| **Authorization**  | ADMIN                                                            |

---

#### 5. Get Paginated Registrations by Course Offering

| Property           | Value                                                                 |
|--------------------|-----------------------------------------------------------------------|
| **Method**         | `GET`                                                                 |
| **Endpoint**       | `/api/v1/course-registration/course-offering/{courseOfferingId}/page` |
| **Authentication** | Required                                                              |
| **Authorization**  | ADMIN                                                                 |

**Query Parameters:**

| Parameter | Type | Description    |
|-----------|------|----------------|
| `page`    | int  | Page number    |
| `size`    | int  | Items per page |

---

#### 6. S2S Endpoints

| Method | Endpoint                                                  | Response                                       |
|--------|-----------------------------------------------------------|------------------------------------------------|
| `GET`  | `/api/v1/course-registration/{id}/validate`               | `Boolean`                                      |
| `GET`  | `/api/v1/course-registration/s2s/batch-details?ids=1,2,3` | `Map<Long, CourseRegistrationDetailsResponse>` |
| `GET`  | `/api/v1/course-registration/s2s/student/{studentId}`     | `List<CourseRegistrationDetailsResponse>`      |

---

## Data Models

### SemesterResponse

```json
{
  "id": "number",
  "name": "string",
  "startDate": "string (yyyy-MM-dd)",
  "endDate": "string (yyyy-MM-dd)"
}
```

### CourseOfferingResponse

```json
{
  "id": "number",
  "maxStudents": "number",
  "currentStudents": "number",
  "openTime": "string (ISO datetime)",
  "closeTime": "string (ISO datetime)",
  "semesterResponse": "SemesterResponse",
  "courseResponse": "CourseResponse",
  "teacherResponse": "TeacherResponse"
}
```

### CourseRegistrationResponse

```json
{
  "id": "number",
  "registrationDate": "string (ISO datetime)",
  "courseRegistrationStatus": "REGISTERED | PROCESSING | CANCELLED",
  "studentId": "number",
  "courseOfferingId": "number"
}
```

### CourseRegistrationSummaryResponse

```json
{
  "courseOfferingId": "number",
  "courseId": "number",
  "courseCode": "string",
  "courseName": "string",
  "semesterName": "string",
  "teacherId": "number",
  "teacherName": "string",
  "maxStudents": "number",
  "currentStudents": "number",
  "registrationStatus": "string"
}
```

---

## Enums

### CourseRegistrationStatus

| Value        | Description                  |
|--------------|------------------------------|
| `REGISTERED` | Successfully registered      |
| `PROCESSING` | Registration being processed |
| `CANCELLED`  | Registration cancelled       |

---

## Business Rules

### Semester

1. **Date Validation:** Start date must be before end date
2. **Overlap Prevention:** Semesters cannot have overlapping date ranges
3. **Cascade Protection:** Cannot delete semester with existing course offerings

### Course Offering

1. **Unique Constraint:** Same course + semester + teacher combination is unique
2. **Validation:** Course, semester, and teacher must exist
3. **Registration Window:** `openTime` must be before `closeTime`

### Course Registration

1. **Unique Constraint:** Same student + course offering is unique
2. **Validation:** Student must exist and have STUDENT role
3. **Capacity Check:** Cannot register if `currentStudents >= maxStudents`
4. **Auto-increment:** Creating registration increments `currentStudents`
5. **Auto-decrement:** Deleting registration decrements `currentStudents`

---

## Error Codes

| Code                        | HTTP Status | Message                      |
|-----------------------------|-------------|------------------------------|
| `SEMESTER_NOT_FOUND`        | 404         | Không tìm thấy học kỳ        |
| `SEMESTER_OVERLAP`          | 409         | Học kỳ bị trùng thời gian    |
| `COURSE_OFFERING_NOT_FOUND` | 404         | Không tìm thấy lớp học phần  |
| `COURSE_OFFERING_FULL`      | 400         | Lớp học phần đã đầy          |
| `REGISTRATION_NOT_FOUND`    | 404         | Không tìm thấy đăng ký       |
| `REGISTRATION_EXISTS`       | 409         | Sinh viên đã đăng ký lớp này |
| `COURSE_NOT_FOUND`          | 404         | Không tìm thấy môn học       |
| `TEACHER_NOT_FOUND`         | 404         | Không tìm thấy giảng viên    |
| `STUDENT_NOT_FOUND`         | 404         | Không tìm thấy sinh viên     |
