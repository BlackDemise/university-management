# Enrollment Service - API Integration Documentation

## Overview

The Enrollment Service manages course enrollment operations and integrates with multiple services. It **consumes** data
from Academic Service (courses) and User Service (teachers, students), and **provides** data to Assessment Service (for
grades and sessions).

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ENROLLMENT SERVICE                                  │
│                            (Port 8004)                                       │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
            ┌───────────────────────┼───────────────────────┐
            │                       │                       │
            ▼                       ▼                       │
 ┌──────────────────┐    ┌──────────────────┐              │
 │ ACADEMIC SERVICE │    │   USER SERVICE   │              │
 │   (Port 8002)    │    │   (Port 8001)    │              │
 │                  │    │                  │              │
 │ Feign Client:    │    │ Feign Client:    │              │
 │ - Course validate│    │ - Teacher validate│             │
 │ - Course details │    │ - Student validate│             │
 │ - Course names   │    │ - Teacher names  │              │
 └──────────────────┘    └──────────────────┘              │
                                                           │
                                                           │ Provides APIs
                                                           │
                                                           ▼
                                               ┌──────────────────┐
                                               │ASSESSMENT SERVICE│
                                               │   (Port 8005)    │
                                               │                  │
                                               │ Consumes via     │
                                               │ Feign Client     │
                                               └──────────────────┘
```

---

## Outbound Integrations (Enrollment Service → Other Services)

### 1. Feign Client: Academic Service

**Client:** `CourseServiceClient`  
**Target Service:** `academic-service`  
**Base Path:** `/api/v1/course`

| Method | Endpoint                    | Purpose                | Response                             |
|--------|-----------------------------|------------------------|--------------------------------------|
| `GET`  | `/{courseId}/validate`      | Validate course exists | `Boolean`                            |
| `GET`  | `/{courseId}/details`       | Get course details     | `CourseResponse`                     |
| `GET`  | `/s2s/all`                  | Get all courses        | `List<CourseResponse>`               |
| `GET`  | `/s2s/names?ids=1,2,3`      | Batch get course names | `Map<Long, String>`                  |
| `GET`  | `/s2s/basic-info?ids=1,2,3` | Batch get course info  | `Map<Long, CourseBasicInfoResponse>` |

#### Usage Scenarios

1. **Creating Course Offering:**
    - Validate course exists before creating offering
    - Fetch course details for response enrichment

2. **Displaying Course Offerings:**
    - Batch fetch course names/info for list display
    - Optimize with batch endpoints to reduce network calls

---

### 2. Feign Client: User Service

**Client:** `UserServiceClient`  
**Target Service:** `user-service`  
**Base Path:** `/api/v1/user`

| Method | Endpoint                          | Purpose                   | Response                            |
|--------|-----------------------------------|---------------------------|-------------------------------------|
| `GET`  | `/teachers/{teacherId}/validate`  | Validate teacher exists   | `TeacherValidationResponse`         |
| `GET`  | `/students/{studentId}/validate`  | Validate student exists   | `StudentValidationResponse`         |
| `GET`  | `/teachers/{teacherId}/details`   | Get teacher details       | `TeacherResponse`                   |
| `GET`  | `/s2s/teacher/all`                | Get all teachers          | `List<TeacherResponse>`             |
| `GET`  | `/s2s/teachers/names?ids=1,2,3`   | Batch get teacher names   | `Map<Long, String>`                 |
| `GET`  | `/s2s/teachers/details?ids=1,2,3` | Batch get teacher details | `Map<Long, TeacherDetailsResponse>` |

#### Usage Scenarios

1. **Creating Course Offering:**
    - Validate teacher exists and has TEACHER role
    - Fetch teacher info for response enrichment

2. **Creating Course Registration:**
    - Validate student exists and has STUDENT role

3. **Displaying Lists:**
    - Batch fetch teacher names for course offering display

---

### Feign Configuration

```java

@FeignClient(name = "academic-service", path = "/api/v1/course")
public interface CourseServiceClient {
    @GetMapping("/{courseId}/validate")
    Boolean validateCourse(@PathVariable Long courseId);

    @GetMapping("/s2s/names")
    Map<Long, String> getCourseNamesByIds(@RequestParam Set<Long> ids);
}

@FeignClient(name = "user-service", path = "/api/v1/user")
public interface UserServiceClient {
    @GetMapping("/teachers/{teacherId}/validate")
    TeacherValidationResponse validateTeacher(@PathVariable Long teacherId);

    @GetMapping("/students/{studentId}/validate")
    StudentValidationResponse validateStudent(@PathVariable Long studentId);
}
```

**Configuration:**

- Connect timeout: 5 seconds
- Read timeout: 10 seconds
- Retry: 3 attempts with exponential backoff (100ms → 1s)
- JWT token forwarding enabled

---

## Inbound Integrations (Other Services → Enrollment Service)

### S2S API Consumers

#### 1. Assessment Service

The Assessment Service calls Enrollment Service to:

| Endpoint Called                                       | Purpose                                       |
|-------------------------------------------------------|-----------------------------------------------|
| `/api/v1/course-offering/{id}/validate`               | Validate offering before creating session     |
| `/api/v1/course-offering/s2s/batch-details`           | Get offering details for session display      |
| `/api/v1/course-offering/s2s/all`                     | Get all offerings for dropdown                |
| `/api/v1/course-registration/{id}/validate`           | Validate registration before creating grade   |
| `/api/v1/course-registration/s2s/batch-details`       | Get registration details for grade display    |
| `/api/v1/course-registration/s2s/student/{studentId}` | Get student's registrations for grade display |

---

## Data Flow Examples

### 1. Create Course Offering Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Admin     │     │  Enrollment  │     │   Academic   │     │ User Service │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │                    │
       │ POST /course-      │                    │                    │
       │ offering           │                    │                    │
       │ {courseId: 1,      │                    │                    │
       │  teacherId: 1}     │                    │                    │
       │───────────────────>│                    │                    │
       │                    │                    │                    │
       │                    │ Validate course    │                    │
       │                    │───────────────────>│                    │
       │                    │                    │                    │
       │                    │ true               │                    │
       │                    │<───────────────────│                    │
       │                    │                    │                    │
       │                    │ Validate teacher   │                    │
       │                    │───────────────────────────────────────>│
       │                    │                    │                    │
       │                    │ {isExist: true,    │                    │
       │                    │  isTeacher: true}  │                    │
       │                    │<───────────────────────────────────────│
       │                    │                    │                    │
       │                    │ Save CourseOffering│                    │
       │                    │                    │                    │
       │ 201 Created        │                    │                    │
       │<───────────────────│                    │                    │
```

### 2. Create Course Registration Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Admin     │     │  Enrollment  │     │ User Service │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │ POST /course-      │                    │
       │ registration       │                    │
       │ {studentId: 1,     │                    │
       │  courseOfferingId: │                    │
       │  1}                │                    │
       │───────────────────>│                    │
       │                    │                    │
       │                    │ Validate student   │
       │                    │───────────────────>│
       │                    │                    │
       │                    │ {isExist: true,    │
       │                    │  isStudent: true}  │
       │                    │<───────────────────│
       │                    │                    │
       │                    │ Check offering     │
       │                    │ capacity           │
       │                    │                    │
       │                    │ Save Registration  │
       │                    │ Increment          │
       │                    │ currentStudents    │
       │                    │                    │
       │ 201 Created        │                    │
       │<───────────────────│                    │
```

### 3. Grade Creation (Assessment → Enrollment)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Admin     │     │  Assessment  │     │  Enrollment  │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │ POST /grade        │                    │
       │ {courseRegistration│                    │
       │  Id: 1}            │                    │
       │───────────────────>│                    │
       │                    │                    │
       │                    │ Validate           │
       │                    │ registration       │
       │                    │───────────────────>│
       │                    │                    │
       │                    │ true               │
       │                    │<───────────────────│
       │                    │                    │
       │                    │ Save Grade         │
       │                    │                    │
       │ 201 Created        │                    │
       │<───────────────────│                    │
```

---

## Configuration

### Feign Client Configuration

```yaml
feign:
  client:
    config:
      default:
        connectTimeout: 5000
        readTimeout: 10000
        loggerLevel: BASIC
```

### Service Configuration

```yaml
spring:
  application:
    name: enrollment-service
  datasource:
    url: jdbc:mysql://localhost:3306/enrollment_service
```

---

## Error Handling

### Feign Client Errors

| Scenario                     | Handling                                              |
|------------------------------|-------------------------------------------------------|
| Academic Service unavailable | Retry 3 times, then throw ServiceUnavailableException |
| User Service unavailable     | Retry 3 times, then throw ServiceUnavailableException |
| Course not found (404)       | Throw CourseNotFoundException                         |
| Teacher not found (404)      | Throw TeacherNotFoundException                        |
| Student not found (404)      | Throw StudentNotFoundException                        |
| Invalid teacher role         | Throw InvalidTeacherRoleException                     |
| Invalid student role         | Throw InvalidStudentRoleException                     |

---

## Service Dependencies Summary

| Dependency             | Type  | Purpose                             |
|------------------------|-------|-------------------------------------|
| **Config Server**      | HTTP  | Configuration management            |
| **Discovery (Eureka)** | HTTP  | Service registration                |
| **Academic Service**   | Feign | Course validation and info          |
| **User Service**       | Feign | Teacher/Student validation and info |
| **MySQL**              | JDBC  | Primary data storage                |

### Dependent By

| Service                | Purpose                                     |
|------------------------|---------------------------------------------|
| **Assessment Service** | Course offering and registration validation |

---

## Database Entities

### Semester

- Primary entity for academic periods
- Referenced by: CourseOffering

### CourseOffering

- Links Course (Academic), Semester, and Teacher (User)
- Referenced by: CourseRegistration, Session (Assessment)
- **Unique Constraint:** `(course_id, semester_id, teacher_id)`

### CourseRegistration

- Links Student (User) with CourseOffering
- Referenced by: Grade (Assessment), Attendance (Assessment)
- **Unique Constraint:** `(student_id, course_offering_id)`

---

## Monitoring

### Key Metrics

- Course offering creation rates
- Registration success/failure rates
- Feign client success/failure rates by target service
- Capacity utilization (currentStudents vs maxStudents)

### Health Endpoints

| Endpoint                 | Description            |
|--------------------------|------------------------|
| `/actuator/health`       | Overall service health |
| `/actuator/health/db`    | Database connectivity  |
| `/actuator/health/feign` | Feign client status    |
