# User Service API Documentation

## Overview

The User Service manages all user-related operations including CRUD for users, teachers, and students. It handles user
creation, updates, role management, and avatar uploads.

**Base URL:** `/api/v1/user` (via Gateway at port 8222)  
**Direct URL:** `http://localhost:8001/api/v1/user`  
**Service Port:** 8001

---

## Endpoints

### User Management

#### 1. Get All Users

| Property           | Value                   |
|--------------------|-------------------------|
| **Method**         | `GET`                   |
| **Endpoint**       | `/api/v1/user/all`      |
| **Authentication** | Required (Bearer Token) |
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
      "fullName": "Admin User",
      "email": "admin@university.edu",
      "role": "ADMIN",
      "displayedRole": "Quản trị viên",
      "phone": "0123456789",
      "avatarUrl": "https://storage.googleapis.com/...",
      "identityNumber": "012345678901",
      "permanentAddress": "123 Main St",
      "currentAddress": "456 University Ave",
      "birthDate": "1990-01-15",
      "teacherResponse": null,
      "studentResponse": null
    }
  ]
}
```

---

#### 2. Get Users (Paginated)

| Property           | Value          |
|--------------------|----------------|
| **Method**         | `GET`          |
| **Endpoint**       | `/api/v1/user` |
| **Authentication** | Required       |
| **Authorization**  | ADMIN          |

**Query Parameters:**

| Parameter         | Type   | Default  | Description                              |
|-------------------|--------|----------|------------------------------------------|
| `page`            | int    | 0        | Page number (0-indexed)                  |
| `size`            | int    | 10       | Items per page                           |
| `sort`            | string | "id,asc" | Sort field and direction                 |
| `searchValue`     | string | ""       | Search term                              |
| `searchCriterion` | string | ""       | Field to search (fullName, email, phone) |

**Response (200 OK):**

```json
{
  "timestamp": 1705920000000,
  "statusCode": 200,
  "message": "Success",
  "result": {
    "content": [
      ...
    ],
    "totalElements": 100,
    "totalPages": 10,
    "number": 0,
    "size": 10
  }
}
```

---

#### 3. Get User by ID

| Property           | Value               |
|--------------------|---------------------|
| **Method**         | `GET`               |
| **Endpoint**       | `/api/v1/user/{id}` |
| **Authentication** | Required            |
| **Authorization**  | ADMIN               |

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id`      | Long | User ID     |

**Response (200 OK):**

```json
{
  "timestamp": 1705920000000,
  "statusCode": 200,
  "message": "Success",
  "result": {
    "id": 1,
    "fullName": "Teacher Name",
    "email": "teacher@university.edu",
    "role": "TEACHER",
    "displayedRole": "Giảng viên",
    "phone": "0123456789",
    "avatarUrl": null,
    "identityNumber": "012345678901",
    "permanentAddress": "123 Main St",
    "currentAddress": "456 University Ave",
    "birthDate": "1985-05-20",
    "teacherResponse": {
      "id": 1,
      "teacherCode": "GV001",
      "academicRank": "Thạc sĩ",
      "degree": "Tiến sĩ"
    },
    "studentResponse": null
  }
}
```

---

#### 4. Create/Update User

| Property           | Value          |
|--------------------|----------------|
| **Method**         | `POST`         |
| **Endpoint**       | `/api/v1/user` |
| **Authentication** | Required       |
| **Authorization**  | ADMIN          |

**Request Body:**

```json
{
  "id": null,
  "fullName": "New User",
  "email": "newuser@university.edu",
  "role": "TEACHER",
  "phone": "0123456789",
  "identityNumber": "012345678901",
  "permanentAddress": "123 Main St",
  "currentAddress": "456 University Ave",
  "birthDate": "1990-01-15",
  "teacherRequest": {
    "id": null,
    "teacherCode": "GV002",
    "academicRank": "Cử nhân",
    "degree": "Thạc sĩ"
  },
  "studentRequest": null
}
```

| Field              | Type   | Required    | Description                    |
|--------------------|--------|-------------|--------------------------------|
| `id`               | Long   | No          | Null for create, ID for update |
| `fullName`         | string | Yes         | User's full name               |
| `email`            | string | Yes         | Valid email format, unique     |
| `role`             | string | Yes         | ADMIN, TEACHER, STUDENT, etc.  |
| `phone`            | string | No          | Phone number                   |
| `identityNumber`   | string | No          | National ID (CCCD)             |
| `permanentAddress` | string | No          | Permanent address              |
| `currentAddress`   | string | No          | Current address                |
| `birthDate`        | string | No          | Format: yyyy-MM-dd             |
| `teacherRequest`   | object | Conditional | Required if role=TEACHER       |
| `studentRequest`   | object | Conditional | Required if role=STUDENT       |

**TeacherRequest:**

```json
{
  "id": null,
  "teacherCode": "GV001",
  "academicRank": "Thạc sĩ",
  "degree": "Tiến sĩ"
}
```

**StudentRequest:**

```json
{
  "id": null,
  "studentCode": "SV001",
  "courseYear": 2024,
  "studentStatus": "ACTIVE",
  "majorId": 1
}
```

**Response (201 Created / 200 OK):**

```json
{
  "timestamp": 1705920000000,
  "statusCode": 201,
  "message": "User created successfully",
  "result": {
    ...
  }
}
```

---

#### 5. Delete User

| Property           | Value               |
|--------------------|---------------------|
| **Method**         | `DELETE`            |
| **Endpoint**       | `/api/v1/user/{id}` |
| **Authentication** | Required            |
| **Authorization**  | ADMIN               |

**Response (200 OK):**

```json
{
  "timestamp": 1705920000000,
  "statusCode": 200,
  "message": "User deleted successfully"
}
```

---

#### 6. Upload Avatar

| Property           | Value                             |
|--------------------|-----------------------------------|
| **Method**         | `POST`                            |
| **Endpoint**       | `/api/v1/user/{id}/upload-avatar` |
| **Authentication** | Required                          |
| **Authorization**  | ADMIN                             |
| **Content-Type**   | `multipart/form-data`             |

**Request:**

```
POST /api/v1/user/1/upload-avatar
Content-Type: multipart/form-data

file: [binary image data]
```

**Response (200 OK):**

```json
{
  "timestamp": 1705920000000,
  "statusCode": 200,
  "message": "Avatar uploaded successfully",
  "result": {
    ...
  }
}
```

---

### Service-to-Service (S2S) Endpoints

These endpoints are used internally by other services.

#### Get Signed Avatar URL

| Property     | Value                              |
|--------------|------------------------------------|
| **Method**   | `GET`                              |
| **Endpoint** | `/api/v1/user/{userId}/avatar-url` |

---

#### Validate Teacher

| Property     | Value                                        |
|--------------|----------------------------------------------|
| **Method**   | `GET`                                        |
| **Endpoint** | `/api/v1/user/teachers/{teacherId}/validate` |

**Response:**

```json
{
  "isExist": true,
  "isTeacher": true
}
```

---

#### Get All Teachers

| Property     | Value                          |
|--------------|--------------------------------|
| **Method**   | `GET`                          |
| **Endpoint** | `/api/v1/user/s2s/teacher/all` |

---

#### Get Teacher Details

| Property     | Value                                       |
|--------------|---------------------------------------------|
| **Method**   | `GET`                                       |
| **Endpoint** | `/api/v1/user/teachers/{teacherId}/details` |

---

#### Batch Get Teacher Names

| Property     | Value                             |
|--------------|-----------------------------------|
| **Method**   | `GET`                             |
| **Endpoint** | `/api/v1/user/s2s/teachers/names` |

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `ids` | Set<Long> | Comma-separated teacher IDs |

**Response:**

```json
{
  "1": "Teacher One",
  "2": "Teacher Two"
}
```

---

#### Batch Get Teacher Details

| Property     | Value                               |
|--------------|-------------------------------------|
| **Method**   | `GET`                               |
| **Endpoint** | `/api/v1/user/s2s/teachers/details` |

---

#### Validate Student

| Property     | Value                                        |
|--------------|----------------------------------------------|
| **Method**   | `GET`                                        |
| **Endpoint** | `/api/v1/user/students/{studentId}/validate` |

---

#### Get All Students

| Property     | Value                          |
|--------------|--------------------------------|
| **Method**   | `GET`                          |
| **Endpoint** | `/api/v1/user/s2s/student/all` |

---

#### Batch Get Student Names

| Property     | Value                             |
|--------------|-----------------------------------|
| **Method**   | `GET`                             |
| **Endpoint** | `/api/v1/user/s2s/students/names` |

---

### Excel Import Endpoints

#### Validate Excel File

| Property         | Value                         |
|------------------|-------------------------------|
| **Method**       | `POST`                        |
| **Endpoint**     | `/api/v1/user/excel/validate` |
| **Content-Type** | `multipart/form-data`         |

---

#### Import Users from Excel

| Property         | Value                       |
|------------------|-----------------------------|
| **Method**       | `POST`                      |
| **Endpoint**     | `/api/v1/user/excel/import` |
| **Content-Type** | `multipart/form-data`       |

---

#### Download Import Template

| Property     | Value                         |
|--------------|-------------------------------|
| **Method**   | `GET`                         |
| **Endpoint** | `/api/v1/user/excel/template` |

**Response:** Excel file (.xlsx)

---

### Role Endpoints

**Base URL:** `/api/v1/role`

#### Get All Roles

| Property           | Value              |
|--------------------|--------------------|
| **Method**         | `GET`              |
| **Endpoint**       | `/api/v1/role/all` |
| **Authentication** | Required           |

**Response (200 OK):**

```json
{
  "timestamp": 1705920000000,
  "statusCode": 200,
  "message": "Success",
  "result": [
    {
      "id": 1,
      "roleTitle": "ADMIN",
      "displayName": "Quản trị viên"
    },
    {
      "id": 2,
      "roleTitle": "TEACHER",
      "displayName": "Giảng viên"
    },
    {
      "id": 3,
      "roleTitle": "STUDENT",
      "displayName": "Sinh viên"
    }
  ]
}
```

---

## Data Models

### UserResponse

```json
{
  "id": "number",
  "fullName": "string",
  "email": "string",
  "role": "string",
  "displayedRole": "string (Vietnamese)",
  "phone": "string",
  "avatarUrl": "string",
  "identityNumber": "string",
  "permanentAddress": "string",
  "currentAddress": "string",
  "birthDate": "string (yyyy-MM-dd)",
  "teacherResponse": "TeacherResponse | null",
  "studentResponse": "StudentResponse | null"
}
```

### TeacherResponse

```json
{
  "id": "number",
  "teacherCode": "string",
  "academicRank": "string",
  "degree": "string"
}
```

### StudentResponse

```json
{
  "id": "number",
  "studentCode": "string",
  "courseYear": "number",
  "studentStatus": "ACTIVE | SUSPENDED | GRADUATED"
}
```

---

## Enums

### RoleTitle

| Value                 | Vietnamese Display        |
|-----------------------|---------------------------|
| `ADMIN`               | Quản trị viên             |
| `TEACHER`             | Giảng viên                |
| `STUDENT`             | Sinh viên                 |
| `ADMINISTRATOR_STAFF` | Nhân viên hành chính      |
| `DORMITORY_STAFF`     | Nhân viên ký túc xá       |
| `LIBRARIAN`           | Thủ thư                   |
| `ALUMNI`              | Cựu sinh viên             |
| `APPLICANT`           | Người nộp đơn             |
| `IT_STAFF`            | Nhân viên hỗ trợ kỹ thuật |
| `FINANCE_STAFF`       | Nhân viên tài chính       |
| `SECURITY_STAFF`      | Nhân viên an ninh         |
| `RESEARCH_MANAGER`    | Quản lý nghiên cứu        |

### StudentStatus

| Value       | Vietnamese Display |
|-------------|--------------------|
| `ACTIVE`    | Đang học           |
| `SUSPENDED` | Bảo lưu            |
| `GRADUATED` | Đã tốt nghiệp      |

---

## Error Codes

| Code                   | HTTP Status | Message                   |
|------------------------|-------------|---------------------------|
| `USER_NOT_FOUND`       | 404         | Không tìm thấy người dùng |
| `EMAIL_ALREADY_EXISTS` | 409         | Email đã tồn tại          |
| `TEACHER_CODE_EXISTS`  | 409         | Mã giảng viên đã tồn tại  |
| `STUDENT_CODE_EXISTS`  | 409         | Mã sinh viên đã tồn tại   |
| `INVALID_ROLE`         | 400         | Vai trò không hợp lệ      |
| `MAJOR_NOT_FOUND`      | 404         | Không tìm thấy ngành học  |
| `VALIDATION_ERROR`     | 400         | Dữ liệu không hợp lệ      |
