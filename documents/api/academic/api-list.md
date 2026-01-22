# Academic Service API Documentation

## Overview

The Academic Service manages all academic-related entities including departments, majors, courses, prerequisites,
program curricula, and department members (faculty assignments).

**Base URL:** `/api/v1/` (via Gateway at port 8222)  
**Direct URL:** `http://localhost:8002/api/v1/`  
**Service Port:** 8002

---

## Endpoints

### Department Management

**Base Path:** `/api/v1/department`

#### 1. Get All Departments

| Property           | Value                    |
|--------------------|--------------------------|
| **Method**         | `GET`                    |
| **Endpoint**       | `/api/v1/department/all` |
| **Authentication** | Required                 |
| **Authorization**  | ADMIN                    |

**Response (200 OK):**

```json
{
  "timestamp": 1705920000000,
  "statusCode": 200,
  "message": "Success",
  "result": [
    {
      "id": 1,
      "name": "Công nghệ thông tin"
    }
  ]
}
```

---

#### 2. Get Departments (Paginated)

| Property           | Value                |
|--------------------|----------------------|
| **Method**         | `GET`                |
| **Endpoint**       | `/api/v1/department` |
| **Authentication** | Required             |
| **Authorization**  | ADMIN                |

**Query Parameters:**

| Parameter         | Type   | Default  | Description              |
|-------------------|--------|----------|--------------------------|
| `page`            | int    | 0        | Page number              |
| `size`            | int    | 10       | Items per page           |
| `sort`            | string | "id,asc" | Sort field and direction |
| `searchValue`     | string | ""       | Search term              |
| `searchCriterion` | string | ""       | Field to search (name)   |

---

#### 3. Get Department by ID

| Property           | Value                     |
|--------------------|---------------------------|
| **Method**         | `GET`                     |
| **Endpoint**       | `/api/v1/department/{id}` |
| **Authentication** | Required                  |
| **Authorization**  | ADMIN                     |

---

#### 4. Create/Update Department

| Property           | Value                |
|--------------------|----------------------|
| **Method**         | `POST`               |
| **Endpoint**       | `/api/v1/department` |
| **Authentication** | Required             |
| **Authorization**  | ADMIN                |

**Request Body:**

```json
{
  "id": null,
  "name": "Khoa Công nghệ thông tin"
}
```

| Field  | Type   | Required | Validation               |
|--------|--------|----------|--------------------------|
| `id`   | Long   | No       | Null for create          |
| `name` | string | Yes      | 2-255 characters, unique |

---

#### 5. Delete Department

| Property           | Value                     |
|--------------------|---------------------------|
| **Method**         | `DELETE`                  |
| **Endpoint**       | `/api/v1/department/{id}` |
| **Authentication** | Required                  |
| **Authorization**  | ADMIN                     |

---

### Major Management

**Base Path:** `/api/v1/major`

#### 1. Get All Majors

| Property           | Value               |
|--------------------|---------------------|
| **Method**         | `GET`               |
| **Endpoint**       | `/api/v1/major/all` |
| **Authentication** | Required            |
| **Authorization**  | ADMIN               |

**Response (200 OK):**

```json
{
  "timestamp": 1705920000000,
  "statusCode": 200,
  "message": "Success",
  "result": [
    {
      "id": 1,
      "name": "Kỹ thuật phần mềm",
      "totalCreditsRequired": 150,
      "departmentResponse": {
        "id": 1,
        "name": "Công nghệ thông tin"
      }
    }
  ]
}
```

---

#### 2. Get Majors (Paginated)

| Property           | Value           |
|--------------------|-----------------|
| **Method**         | `GET`           |
| **Endpoint**       | `/api/v1/major` |
| **Authentication** | Required        |
| **Authorization**  | ADMIN           |

---

#### 3. Get Major Curriculum Summary

| Property           | Value                              |
|--------------------|------------------------------------|
| **Method**         | `GET`                              |
| **Endpoint**       | `/api/v1/major/curriculum-summary` |
| **Authentication** | Required                           |
| **Authorization**  | ADMIN                              |

Returns majors with course counts and total credits.

---

#### 4. Create/Update Major

| Property           | Value           |
|--------------------|-----------------|
| **Method**         | `POST`          |
| **Endpoint**       | `/api/v1/major` |
| **Authentication** | Required        |
| **Authorization**  | ADMIN           |

**Request Body:**

```json
{
  "id": null,
  "name": "Kỹ thuật phần mềm",
  "totalCreditsRequired": 150,
  "departmentId": 1
}
```

| Field                  | Type   | Required | Validation       |
|------------------------|--------|----------|------------------|
| `id`                   | Long   | No       | Null for create  |
| `name`                 | string | Yes      | 2-255 characters |
| `totalCreditsRequired` | int    | Yes      | 1-300            |
| `departmentId`         | Long   | Yes      | Must exist       |

---

#### 5. Validate Major (S2S)

| Property     | Value                              |
|--------------|------------------------------------|
| **Method**   | `GET`                              |
| **Endpoint** | `/api/v1/major/{majorId}/validate` |
| **Usage**    | Service-to-Service                 |

**Response:** `Boolean`

---

### Course Management

**Base Path:** `/api/v1/course`

#### 1. Get Course Type Enums

| Property           | Value                              |
|--------------------|------------------------------------|
| **Method**         | `GET`                              |
| **Endpoint**       | `/api/v1/course/enum/course-types` |
| **Authentication** | Required                           |
| **Authorization**  | ADMIN                              |

**Response:**

```json
{
  "result": [
    {
      "value": "GENERAL",
      "displayName": "Đại cương"
    },
    {
      "value": "SPECIALIZED",
      "displayName": "Chuyên ngành"
    },
    {
      "value": "ELECTIVE",
      "displayName": "Tự chọn"
    }
  ]
}
```

---

#### 2. Get All Courses

| Property           | Value                |
|--------------------|----------------------|
| **Method**         | `GET`                |
| **Endpoint**       | `/api/v1/course/all` |
| **Authentication** | Required             |
| **Authorization**  | ADMIN                |

**Response:**

```json
{
  "result": [
    {
      "id": 1,
      "courseCode": "CS101",
      "name": "Nhập môn lập trình",
      "creditsTheory": 2,
      "creditsPractical": 1,
      "courseType": "GENERAL",
      "displayedCourseType": "Đại cương"
    }
  ]
}
```

---

#### 3. Get Courses (Paginated)

| Property           | Value            |
|--------------------|------------------|
| **Method**         | `GET`            |
| **Endpoint**       | `/api/v1/course` |
| **Authentication** | Required         |
| **Authorization**  | ADMIN            |

**Query Parameters:**

| Parameter         | Type   | Default  | Description              |
|-------------------|--------|----------|--------------------------|
| `page`            | int    | 0        | Page number              |
| `size`            | int    | 10       | Items per page           |
| `sort`            | string | "id,asc" | Sort field               |
| `searchValue`     | string | ""       | Search term              |
| `searchCriterion` | string | ""       | Field (courseCode, name) |

---

#### 4. Create/Update Course

| Property           | Value            |
|--------------------|------------------|
| **Method**         | `POST`           |
| **Endpoint**       | `/api/v1/course` |
| **Authentication** | Required         |
| **Authorization**  | ADMIN            |

**Request Body:**

```json
{
  "id": null,
  "courseCode": "CS101",
  "name": "Nhập môn lập trình",
  "creditsTheory": 2,
  "creditsPractical": 1,
  "courseType": "GENERAL"
}
```

---

#### 5. S2S Endpoints

| Method | Endpoint                                  | Response                             |
|--------|-------------------------------------------|--------------------------------------|
| `GET`  | `/api/v1/course/{courseId}/validate`      | `Boolean`                            |
| `GET`  | `/api/v1/course/{courseId}/details`       | `CourseResponse`                     |
| `GET`  | `/api/v1/course/s2s/all`                  | `List<CourseResponse>`               |
| `GET`  | `/api/v1/course/s2s/names?ids=1,2,3`      | `Map<Long, String>`                  |
| `GET`  | `/api/v1/course/s2s/basic-info?ids=1,2,3` | `Map<Long, CourseBasicInfoResponse>` |

---

### Prerequisite Course Management

**Base Path:** `/api/v1/prerequisite-course`

#### 1. Get All Prerequisites

| Property           | Value                             |
|--------------------|-----------------------------------|
| **Method**         | `GET`                             |
| **Endpoint**       | `/api/v1/prerequisite-course/all` |
| **Authentication** | Required                          |
| **Authorization**  | ADMIN                             |

---

#### 2. Get Course Prerequisites Summary

| Property           | Value                                 |
|--------------------|---------------------------------------|
| **Method**         | `GET`                                 |
| **Endpoint**       | `/api/v1/prerequisite-course/courses` |
| **Authentication** | Required                              |
| **Authorization**  | ADMIN                                 |

Returns all courses with their prerequisite information.

---

#### 3. Get Prerequisites for Course

| Property           | Value                                           |
|--------------------|-------------------------------------------------|
| **Method**         | `GET`                                           |
| **Endpoint**       | `/api/v1/prerequisite-course/course/{courseId}` |
| **Authentication** | Required                                        |
| **Authorization**  | ADMIN                                           |

---

#### 4. Get Available Prerequisites

| Property           | Value                                                     |
|--------------------|-----------------------------------------------------------|
| **Method**         | `GET`                                                     |
| **Endpoint**       | `/api/v1/prerequisite-course/course/{courseId}/available` |
| **Authentication** | Required                                                  |
| **Authorization**  | ADMIN                                                     |

Returns courses that can be added as prerequisites (excludes circular dependencies).

---

#### 5. Bulk Update Prerequisites

| Property           | Value                                           |
|--------------------|-------------------------------------------------|
| **Method**         | `PUT`                                           |
| **Endpoint**       | `/api/v1/prerequisite-course/course/{courseId}` |
| **Authentication** | Required                                        |
| **Authorization**  | ADMIN                                           |

**Request Body:**

```json
{
  "courseId": 1,
  "prerequisiteIdsToAdd": [
    2,
    3
  ],
  "prerequisiteIdsToRemove": [
    4
  ]
}
```

---

#### 6. Validate Prerequisite Addition

| Property           | Value                                                              |
|--------------------|--------------------------------------------------------------------|
| **Method**         | `GET`                                                              |
| **Endpoint**       | `/api/v1/prerequisite-course/validate?courseId=1&prerequisiteId=2` |
| **Authentication** | Required                                                           |
| **Authorization**  | ADMIN                                                              |

Returns `Boolean` - false if would create circular dependency.

---

### Program Curriculum Management

**Base Path:** `/api/v1/program-curriculum`

#### 1. Get All Curricula

| Property           | Value                            |
|--------------------|----------------------------------|
| **Method**         | `GET`                            |
| **Endpoint**       | `/api/v1/program-curriculum/all` |
| **Authentication** | Required                         |
| **Authorization**  | ADMIN                            |

**Response:**

```json
{
  "result": [
    {
      "id": 1,
      "courseResponse": {
        ...
      },
      "majorResponse": {
        ...
      },
      "isMandatory": true,
      "semesterRecommended": 1
    }
  ]
}
```

---

#### 2. Get Curriculum (Paginated)

| Property           | Value                        |
|--------------------|------------------------------|
| **Method**         | `GET`                        |
| **Endpoint**       | `/api/v1/program-curriculum` |
| **Authentication** | Required                     |
| **Authorization**  | ADMIN                        |

---

#### 3. Create/Update Curriculum

| Property           | Value                        |
|--------------------|------------------------------|
| **Method**         | `POST`                       |
| **Endpoint**       | `/api/v1/program-curriculum` |
| **Authentication** | Required                     |
| **Authorization**  | ADMIN                        |

**Request Body:**

```json
{
  "id": null,
  "courseId": 1,
  "majorId": 1,
  "isMandatory": true,
  "semesterRecommended": 1
}
```

---

#### 4. Get Courses in Major

| Property           | Value                                                |
|--------------------|------------------------------------------------------|
| **Method**         | `GET`                                                |
| **Endpoint**       | `/api/v1/program-curriculum/major/{majorId}/courses` |
| **Authentication** | Required                                             |
| **Authorization**  | ADMIN                                                |

---

### Department Member Management

**Base Path:** `/api/v1/department-member`

Manages faculty assignments to departments (teachers and faculty heads).

#### 1. Get Member Type Enums

| Property           | Value                                                   |
|--------------------|---------------------------------------------------------|
| **Method**         | `GET`                                                   |
| **Endpoint**       | `/api/v1/department-member/enum/department-member-type` |
| **Authentication** | Required                                                |
| **Authorization**  | ADMIN                                                   |

**Response:**

```json
{
  "result": [
    {
      "value": "TEACHER",
      "displayName": "Giảng viên"
    },
    {
      "value": "FACULTY_HEAD",
      "displayName": "Trưởng khoa"
    }
  ]
}
```

---

#### 2. Get Available Teachers

| Property           | Value                                |
|--------------------|--------------------------------------|
| **Method**         | `GET`                                |
| **Endpoint**       | `/api/v1/department-member/teachers` |
| **Authentication** | Required                             |
| **Authorization**  | ADMIN                                |

Returns teachers that can be assigned to departments (from User Service).

---

#### 3. Get Department Members with Details

| Property           | Value                               |
|--------------------|-------------------------------------|
| **Method**         | `GET`                               |
| **Endpoint**       | `/api/v1/department-member/details` |
| **Authentication** | Required                            |
| **Authorization**  | ADMIN                               |

Returns department members with full teacher details.

---

#### 4. Create/Update Department Member

| Property           | Value                       |
|--------------------|-----------------------------|
| **Method**         | `POST`                      |
| **Endpoint**       | `/api/v1/department-member` |
| **Authentication** | Required                    |
| **Authorization**  | ADMIN                       |

**Request Body:**

```json
{
  "id": null,
  "departmentId": 1,
  "teacherId": 1,
  "departmentMemberType": "TEACHER",
  "startDate": "2024-01-01T00:00:00",
  "endDate": null
}
```

---

#### 5. Get Members by Department

| Property           | Value                                                 |
|--------------------|-------------------------------------------------------|
| **Method**         | `GET`                                                 |
| **Endpoint**       | `/api/v1/department-member/department/{departmentId}` |
| **Authentication** | Required                                              |
| **Authorization**  | ADMIN                                                 |

---

#### 6. Get Memberships by Teacher

| Property           | Value                                           |
|--------------------|-------------------------------------------------|
| **Method**         | `GET`                                           |
| **Endpoint**       | `/api/v1/department-member/teacher/{teacherId}` |
| **Authentication** | Required                                        |
| **Authorization**  | ADMIN                                           |

---

#### 7. Remove All Teacher Memberships

| Property           | Value                                           |
|--------------------|-------------------------------------------------|
| **Method**         | `DELETE`                                        |
| **Endpoint**       | `/api/v1/department-member/teacher/{teacherId}` |
| **Authentication** | Required                                        |
| **Authorization**  | ADMIN                                           |

---

## Data Models

### CourseResponse

```json
{
  "id": "number",
  "courseCode": "string",
  "name": "string",
  "creditsTheory": "number",
  "creditsPractical": "number",
  "courseType": "GENERAL | SPECIALIZED | ELECTIVE",
  "displayedCourseType": "string (Vietnamese)"
}
```

### DepartmentResponse

```json
{
  "id": "number",
  "name": "string"
}
```

### MajorResponse

```json
{
  "id": "number",
  "name": "string",
  "totalCreditsRequired": "number",
  "departmentResponse": "DepartmentResponse"
}
```

### DepartmentMemberResponse

```json
{
  "id": "number",
  "departmentResponse": "DepartmentResponse",
  "teacherId": "number",
  "departmentMemberType": "TEACHER | FACULTY_HEAD",
  "startDate": "string (ISO datetime)",
  "endDate": "string (ISO datetime) | null"
}
```

---

## Enums

### CourseType

| Value         | Vietnamese Display |
|---------------|--------------------|
| `GENERAL`     | Đại cương          |
| `SPECIALIZED` | Chuyên ngành       |
| `ELECTIVE`    | Tự chọn            |

### DepartmentMemberType

| Value          | Vietnamese Display |
|----------------|--------------------|
| `TEACHER`      | Giảng viên         |
| `FACULTY_HEAD` | Trưởng khoa        |

---

## Error Codes

| Code                     | HTTP Status | Message                           |
|--------------------------|-------------|-----------------------------------|
| `DEPARTMENT_NOT_FOUND`   | 404         | Không tìm thấy khoa               |
| `DEPARTMENT_NAME_EXISTS` | 409         | Tên khoa đã tồn tại               |
| `MAJOR_NOT_FOUND`        | 404         | Không tìm thấy ngành học          |
| `COURSE_NOT_FOUND`       | 404         | Không tìm thấy môn học            |
| `COURSE_CODE_EXISTS`     | 409         | Mã môn học đã tồn tại             |
| `CIRCULAR_PREREQUISITE`  | 400         | Phát hiện vòng lặp môn tiên quyết |
| `TEACHER_NOT_FOUND`      | 404         | Không tìm thấy giảng viên         |
| `CURRICULUM_EXISTS`      | 409         | Môn học đã có trong chương trình  |
