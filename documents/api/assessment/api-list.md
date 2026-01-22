# Assessment Service API Documentation

## Overview

The Assessment Service manages academic assessment operations including sessions (class schedules), attendance tracking,
and grade management.

**Base URL:** `/api/v1/` (via Gateway at port 8222)  
**Direct URL:** `http://localhost:8005/api/v1/`  
**Service Port:** 8005

---

## Endpoints

### Session Management

**Base Path:** `/api/v1/session`

Sessions represent individual class meetings (lectures, labs, exams) for course offerings.

#### 1. Get All Sessions

| Property           | Value                 |
|--------------------|-----------------------|
| **Method**         | `GET`                 |
| **Endpoint**       | `/api/v1/session/all` |
| **Authentication** | Required              |
| **Authorization**  | ADMIN                 |

**Response (200 OK):**

```json
{
  "timestamp": 1705920000000,
  "statusCode": 200,
  "message": "Success",
  "result": [
    {
      "id": 1,
      "sessionType": "LECTURE",
      "sessionNumber": 1,
      "startTime": "2024-09-02T08:00:00",
      "endTime": "2024-09-02T10:00:00",
      "courseOfferingId": 1,
      "classroomId": 1
    }
  ]
}
```

---

#### 2. Get Session Summary (Paginated)

| Property           | Value                     |
|--------------------|---------------------------|
| **Method**         | `GET`                     |
| **Endpoint**       | `/api/v1/session/summary` |
| **Authentication** | Required                  |
| **Authorization**  | ADMIN                     |

**Query Parameters:**

| Parameter     | Type   | Default | Description    |
|---------------|--------|---------|----------------|
| `page`        | int    | 0       | Page number    |
| `size`        | int    | 10      | Items per page |
| `searchValue` | string | ""      | Search term    |

**Response:**

```json
{
  "result": {
    "content": [
      {
        "courseOfferingId": 1,
        "courseId": 1,
        "courseName": "Nhập môn lập trình",
        "courseCode": "CS101",
        "semesterName": "Học kỳ 1 - 2024-2025",
        "teacherName": "Nguyễn Văn A",
        "teacherEmail": "teacher@university.edu",
        "totalSessionsRecorded": 15
      }
    ]
  }
}
```

---

#### 3. Get Sessions by Course Offering

| Property           | Value                                                |
|--------------------|------------------------------------------------------|
| **Method**         | `GET`                                                |
| **Endpoint**       | `/api/v1/session/course-offering/{courseOfferingId}` |
| **Authentication** | Required                                             |
| **Authorization**  | ADMIN                                                |

---

#### 4. Get Sessions by Course Offering (Paginated)

| Property           | Value                                                     |
|--------------------|-----------------------------------------------------------|
| **Method**         | `GET`                                                     |
| **Endpoint**       | `/api/v1/session/course-offering/{courseOfferingId}/page` |
| **Authentication** | Required                                                  |
| **Authorization**  | ADMIN                                                     |

**Response:**

```json
{
  "result": {
    "content": [
      {
        "id": 1,
        "sessionType": "LECTURE",
        "sessionNumber": 1,
        "startTime": "2024-09-02T08:00:00",
        "endTime": "2024-09-02T10:00:00",
        "courseOfferingId": 1,
        "classroomId": 1,
        "courseName": "Nhập môn lập trình",
        "courseCode": "CS101",
        "semesterName": "Học kỳ 1",
        "teacherName": "Nguyễn Văn A",
        "teacherEmail": "teacher@university.edu",
        "classroomName": "A101",
        "classroomType": "Phòng học lý thuyết"
      }
    ]
  }
}
```

---

#### 5. Create/Update Session

| Property           | Value             |
|--------------------|-------------------|
| **Method**         | `POST`            |
| **Endpoint**       | `/api/v1/session` |
| **Authentication** | Required          |
| **Authorization**  | ADMIN             |

**Request Body:**

```json
{
  "id": null,
  "sessionType": "LECTURE",
  "sessionNumber": 1,
  "startTime": "2024-09-02 08:00:00",
  "endTime": "2024-09-02 10:00:00",
  "courseOfferingId": 1,
  "classroomId": 1
}
```

| Field              | Type   | Required | Description                 |
|--------------------|--------|----------|-----------------------------|
| `id`               | Long   | No       | Null for create             |
| `sessionType`      | string | Yes      | LECTURE, LAB, EXAM          |
| `sessionNumber`    | int    | Yes      | Session sequence number     |
| `startTime`        | string | Yes      | Format: yyyy-MM-dd HH:mm:ss |
| `endTime`          | string | Yes      | Format: yyyy-MM-dd HH:mm:ss |
| `courseOfferingId` | Long   | Yes      | Course offering reference   |
| `classroomId`      | Long   | Yes      | Classroom reference         |

---

#### 6. Delete Session

| Property           | Value                  |
|--------------------|------------------------|
| **Method**         | `DELETE`               |
| **Endpoint**       | `/api/v1/session/{id}` |
| **Authentication** | Required               |
| **Authorization**  | ADMIN                  |

**Note:** Cannot delete sessions that have attendance records.

---

### Attendance Management

**Base Path:** `/api/v1/attendance`

#### 1. Get All Attendance Records

| Property           | Value                    |
|--------------------|--------------------------|
| **Method**         | `GET`                    |
| **Endpoint**       | `/api/v1/attendance/all` |
| **Authentication** | Required                 |
| **Authorization**  | ADMIN                    |

**Response:**

```json
{
  "result": [
    {
      "id": 1,
      "attendanceStatus": "PRESENT",
      "studentId": 1,
      "scheduleId": 1
    }
  ]
}
```

---

#### 2. Get Attendance by ID

| Property           | Value                     |
|--------------------|---------------------------|
| **Method**         | `GET`                     |
| **Endpoint**       | `/api/v1/attendance/{id}` |
| **Authentication** | Required                  |
| **Authorization**  | ADMIN                     |

---

#### 3. Create/Update Attendance

| Property           | Value                |
|--------------------|----------------------|
| **Method**         | `POST`               |
| **Endpoint**       | `/api/v1/attendance` |
| **Authentication** | Required             |
| **Authorization**  | ADMIN                |

**Request Body:**

```json
{
  "id": null,
  "attendanceStatus": "PRESENT",
  "studentId": 1,
  "sessionId": 1
}
```

| Field              | Type   | Required | Description       |
|--------------------|--------|----------|-------------------|
| `id`               | Long   | No       | Null for create   |
| `attendanceStatus` | string | Yes      | PRESENT, ABSENT   |
| `studentId`        | Long   | Yes      | Student reference |
| `sessionId`        | Long   | Yes      | Session reference |

---

#### 4. Delete Attendance

| Property           | Value                     |
|--------------------|---------------------------|
| **Method**         | `DELETE`                  |
| **Endpoint**       | `/api/v1/attendance/{id}` |
| **Authentication** | Required                  |
| **Authorization**  | ADMIN                     |

---

### Grade Management

**Base Path:** `/api/v1/grade`

#### 1. Get All Grades

| Property           | Value               |
|--------------------|---------------------|
| **Method**         | `GET`               |
| **Endpoint**       | `/api/v1/grade/all` |
| **Authentication** | Required            |
| **Authorization**  | ADMIN               |

**Response:**

```json
{
  "result": [
    {
      "id": 1,
      "gradeType": "MID_TERM",
      "gradeValue": 8.5,
      "courseRegistrationId": 1
    }
  ]
}
```

---

#### 2. Get Grade by ID

| Property           | Value                |
|--------------------|----------------------|
| **Method**         | `GET`                |
| **Endpoint**       | `/api/v1/grade/{id}` |
| **Authentication** | Required             |
| **Authorization**  | ADMIN                |

---

#### 3. Create/Update Grade

| Property           | Value           |
|--------------------|-----------------|
| **Method**         | `POST`          |
| **Endpoint**       | `/api/v1/grade` |
| **Authentication** | Required        |
| **Authorization**  | ADMIN           |

**Request Body:**

```json
{
  "id": null,
  "gradeType": "MID_TERM",
  "gradeValue": 8.5,
  "courseRegistrationId": 1
}
```

| Field                  | Type   | Required | Validation      |
|------------------------|--------|----------|-----------------|
| `id`                   | Long   | No       | Null for create |
| `gradeType`            | string | Yes      | See enum below  |
| `gradeValue`           | double | Yes      | 0.0 - 10.0      |
| `courseRegistrationId` | Long   | Yes      | Must exist      |

---

#### 4. Delete Grade

| Property           | Value                |
|--------------------|----------------------|
| **Method**         | `DELETE`             |
| **Endpoint**       | `/api/v1/grade/{id}` |
| **Authentication** | Required             |
| **Authorization**  | ADMIN                |

---

#### 5. Get Student Grade Details (S2S)

| Property     | Value                                           |
|--------------|-------------------------------------------------|
| **Method**   | `GET`                                           |
| **Endpoint** | `/api/v1/grade/s2s/student/{studentId}/details` |
| **Usage**    | Service-to-Service                              |

**Response:**

```json
{
  "studentId": 1,
  "studentName": "Trần Văn B",
  "studentCode": "SV001",
  "studentEmail": "student@university.edu",
  "gradesByCourse": {
    "CS101 - Nhập môn lập trình": {
      "courseId": 1,
      "courseCode": "CS101",
      "courseName": "Nhập môn lập trình",
      "semesterName": "Học kỳ 1 - 2024-2025",
      "courseRegistrationId": 1,
      "grades": [
        {
          "id": 1,
          "gradeType": "MID_TERM",
          "gradeValue": 8.5,
          "courseRegistrationId": 1
        }
      ]
    }
  }
}
```

---

#### 6. Get Grades by Course Registration (S2S)

| Property     | Value                                                          |
|--------------|----------------------------------------------------------------|
| **Method**   | `GET`                                                          |
| **Endpoint** | `/api/v1/grade/s2s/course-registration/{courseRegistrationId}` |
| **Usage**    | Service-to-Service                                             |

---

## Data Models

### SessionResponse

```json
{
  "id": "number",
  "sessionType": "LECTURE | LAB | EXAM",
  "sessionNumber": "number",
  "startTime": "string (ISO datetime)",
  "endTime": "string (ISO datetime)",
  "courseOfferingId": "number",
  "classroomId": "number"
}
```

### AttendanceResponse

```json
{
  "id": "number",
  "attendanceStatus": "PRESENT | ABSENT",
  "studentId": "number",
  "scheduleId": "number"
}
```

### GradeResponse

```json
{
  "id": "number",
  "gradeType": "string",
  "gradeValue": "number (0-10)",
  "courseRegistrationId": "number"
}
```

---

## Enums

### SessionType

| Value     | Vietnamese Display | Description           |
|-----------|--------------------|-----------------------|
| `LECTURE` | Lý thuyết          | Theory class          |
| `LAB`     | Thực hành          | Practical/lab session |
| `EXAM`    | Thi                | Exam session          |

### AttendanceStatus

| Value     | Vietnamese Display |
|-----------|--------------------|
| `PRESENT` | Có mặt             |
| `ABSENT`  | Vắng mặt           |

### GradeType

| Value        | Description        |
|--------------|--------------------|
| `MID_TERM`   | Midterm exam       |
| `FINAL`      | Final exam         |
| `LAB`        | Lab/practical work |
| `PROJECT`    | Project assessment |
| `ASSIGNMENT` | Assignment         |
| `QUIZ`       | Quiz               |
| `EXAM`       | General exam       |

---

## Business Rules

### Session

1. **Time Validation:** startTime must be before endTime
2. **Unique Constraint:** Same classroom cannot have overlapping sessions
3. **Cascade Protection:** Cannot delete session with attendance records
4. **Course Offering Validation:** Must belong to valid course offering
5. **Classroom Validation:** Must use valid classroom

### Attendance

1. **Unique Constraint:** One attendance per student per session
2. **Student Validation:** Student must exist and have STUDENT role
3. **Session Validation:** Session must exist
4. **Timing:** Attendance can only be recorded for past/current sessions

### Grade

1. **Value Range:** Grade value must be between 0.0 and 10.0
2. **Unique Constraint:** One grade per type per course registration
3. **Registration Validation:** Course registration must exist

---

## Error Codes

| Code                        | HTTP Status | Message                                |
|-----------------------------|-------------|----------------------------------------|
| `SESSION_NOT_FOUND`         | 404         | Không tìm thấy buổi học                |
| `SESSION_HAS_ATTENDANCE`    | 400         | Không thể xóa buổi học đã có điểm danh |
| `CLASSROOM_CONFLICT`        | 409         | Phòng học bị trùng thời gian           |
| `ATTENDANCE_NOT_FOUND`      | 404         | Không tìm thấy bản ghi điểm danh       |
| `ATTENDANCE_EXISTS`         | 409         | Sinh viên đã điểm danh                 |
| `GRADE_NOT_FOUND`           | 404         | Không tìm thấy điểm số                 |
| `GRADE_EXISTS`              | 409         | Loại điểm đã tồn tại                   |
| `INVALID_GRADE_VALUE`       | 400         | Điểm phải từ 0 đến 10                  |
| `COURSE_OFFERING_NOT_FOUND` | 404         | Không tìm thấy lớp học phần            |
| `STUDENT_NOT_FOUND`         | 404         | Không tìm thấy sinh viên               |
