# Assessment Service - API Integration Documentation

## Overview

The Assessment Service is the most downstream service in the data flow, consuming data from multiple services to manage
sessions, attendance, and grades. It does not produce data for other services.

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ASSESSMENT SERVICE                                  │
│                            (Port 8005)                                       │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌──────────────────┐     ┌──────────────────┐        ┌──────────────────┐
│   USER SERVICE   │     │ENROLLMENT SERVICE│        │ FACILITY SERVICE │
│   (Port 8001)    │     │   (Port 8004)    │        │   (Port 8003)    │
│                  │     │                  │        │                  │
│ - Student valid  │     │ - Offering valid │        │ - Classroom valid│
│ - Student details│     │ - Reg. valid     │        │ - Classroom info │
└──────────────────┘     │ - Offering info  │        └──────────────────┘
                         │ - Student regs   │
                         └──────────────────┘
                                    │
                                    │ (for course info)
                                    ▼
                         ┌──────────────────┐
                         │ ACADEMIC SERVICE │
                         │   (Port 8002)    │
                         │                  │
                         │ - Course basic   │
                         │   info           │
                         └──────────────────┘
```

---

## Outbound Integrations (Assessment Service → Other Services)

### 1. Feign Client: User Service

**Client:** `UserServiceClient`  
**Target Service:** `user-service`  
**Base Path:** `/api/v1/user`

| Method | Endpoint                         | Purpose                               | Response                    |
|--------|----------------------------------|---------------------------------------|-----------------------------|
| `GET`  | `/students/{studentId}/validate` | Validate student for attendance/grade | `StudentValidationResponse` |
| `GET`  | `/students/{studentId}/details`  | Get student details for grade display | `StudentDetailsResponse`    |

#### Usage Scenarios

1. **Creating Attendance:**
    - Validate student exists and has STUDENT role

2. **Grade Details Display:**
    - Fetch student info (name, code, email) for comprehensive grade report

---

### 2. Feign Client: Enrollment Service

**Client:** `EnrollmentServiceClient`  
**Target Service:** `enrollment-service`

| Method | Endpoint                                                  | Purpose                         | Response                                 |
|--------|-----------------------------------------------------------|---------------------------------|------------------------------------------|
| `GET`  | `/api/v1/course-registration/{id}/validate`               | Validate registration for grade | `Boolean`                                |
| `GET`  | `/api/v1/course-offering/{id}/validate`                   | Validate offering for session   | `Boolean`                                |
| `GET`  | `/api/v1/course-registration/s2s/batch-details?ids=1,2,3` | Batch get registration info     | `Map<Long, RegistrationDetailsResponse>` |
| `GET`  | `/api/v1/course-registration/s2s/student/{studentId}`     | Get student's registrations     | `List<RegistrationDetailsResponse>`      |
| `GET`  | `/api/v1/course-offering/s2s/batch-details?ids=1,2,3`     | Batch get offering info         | `Map<Long, OfferingDetailsResponse>`     |
| `GET`  | `/api/v1/course-offering/s2s/all`                         | Get all offerings               | `List<OfferingDetailsResponse>`          |

#### Usage Scenarios

1. **Creating Session:**
    - Validate course offering exists

2. **Creating Grade:**
    - Validate course registration exists

3. **Grade Details Display:**
    - Fetch all registrations for a student
    - Get course offering details for each registration

4. **Session Summary:**
    - Batch fetch course offering details for display

---

### 3. Feign Client: Facility Service

**Client:** `FacilityServiceClient`  
**Target Service:** `facility-service`  
**Base Path:** `/api/v1/classroom`

| Method | Endpoint                                | Purpose                        | Response                              |
|--------|-----------------------------------------|--------------------------------|---------------------------------------|
| `GET`  | `/validate/{classroomId}`               | Validate classroom for session | `ClassroomValidationResponse`         |
| `GET`  | `/s2s/batch-details?classroomIds=1,2,3` | Batch get classroom info       | `Map<Long, ClassroomDetailsResponse>` |
| `GET`  | `/s2s/all`                              | Get all classrooms             | `List<ClassroomDetailsResponse>`      |

#### Usage Scenarios

1. **Creating Session:**
    - Validate classroom exists and get type

2. **Session Display:**
    - Fetch classroom details (name, type) for session listings

---

### 4. Feign Client: Academic Service

**Client:** `AcademicServiceClient`  
**Target Service:** `academic-service`  
**Base Path:** `/api/v1/course`

| Method | Endpoint                       | Purpose               | Response                             |
|--------|--------------------------------|-----------------------|--------------------------------------|
| `GET`  | `/s2s/basic-info/v1?ids=1,2,3` | Get course basic info | `Map<Long, CourseBasicInfoResponse>` |

#### Usage Scenarios

1. **Session Summary Display:**
    - Fetch course names and codes for session summary view

---

## Inbound Integrations

**None** - The Assessment Service is a consumer-only service. No other services call Assessment Service APIs (except for
potential reporting services in the future).

---

## Data Flow Examples

### 1. Create Session Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Admin     │     │  Assessment  │     │  Enrollment  │     │   Facility   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │                    │
       │ POST /session      │                    │                    │
       │ {courseOfferingId, │                    │                    │
       │  classroomId}      │                    │                    │
       │───────────────────>│                    │                    │
       │                    │                    │                    │
       │                    │ Validate offering  │                    │
       │                    │───────────────────>│                    │
       │                    │                    │                    │
       │                    │ true               │                    │
       │                    │<───────────────────│                    │
       │                    │                    │                    │
       │                    │ Validate classroom │                    │
       │                    │───────────────────────────────────────>│
       │                    │                    │                    │
       │                    │ {isExists: true}   │                    │
       │                    │<───────────────────────────────────────│
       │                    │                    │                    │
       │                    │ Save Session       │                    │
       │                    │                    │                    │
       │ 201 Created        │                    │                    │
       │<───────────────────│                    │                    │
```

### 2. Create Grade Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Admin     │     │  Assessment  │     │  Enrollment  │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │ POST /grade        │                    │
       │ {courseRegistration│                    │
       │  Id: 1,            │                    │
       │  gradeType: "MID", │                    │
       │  gradeValue: 8.5}  │                    │
       │───────────────────>│                    │
       │                    │                    │
       │                    │ Validate           │
       │                    │ registration       │
       │                    │───────────────────>│
       │                    │                    │
       │                    │ true               │
       │                    │<───────────────────│
       │                    │                    │
       │                    │ Check duplicate    │
       │                    │ grade type         │
       │                    │                    │
       │                    │ Save Grade         │
       │                    │                    │
       │ 201 Created        │                    │
       │<───────────────────│                    │
```

### 3. Get Student Grade Details Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │     │  Assessment  │     │  Enrollment  │     │ User Service │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │                    │
       │ GET /grade/s2s/    │                    │                    │
       │ student/1/details  │                    │                    │
       │───────────────────>│                    │                    │
       │                    │                    │                    │
       │                    │ Get student details│                    │
       │                    │───────────────────────────────────────>│
       │                    │                    │                    │
       │                    │ {name, code, email}│                    │
       │                    │<───────────────────────────────────────│
       │                    │                    │                    │
       │                    │ Get student's      │                    │
       │                    │ registrations      │                    │
       │                    │───────────────────>│                    │
       │                    │                    │                    │
       │                    │ [{courseOfferingId,│                    │
       │                    │   courseId, ...}]  │                    │
       │                    │<───────────────────│                    │
       │                    │                    │                    │
       │                    │ Get grades from DB │                    │
       │                    │ Group by course    │                    │
       │                    │                    │                    │
       │ StudentGradeDetails│                    │                    │
       │<───────────────────│                    │                    │
```

### 4. Create Attendance Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Admin     │     │  Assessment  │     │ User Service │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │ POST /attendance   │                    │
       │ {studentId: 1,     │                    │
       │  sessionId: 1,     │                    │
       │  status: "PRESENT"}│                    │
       │───────────────────>│                    │
       │                    │                    │
       │                    │ Validate student   │
       │                    │───────────────────>│
       │                    │                    │
       │                    │ {isExist: true,    │
       │                    │  isStudent: true}  │
       │                    │<───────────────────│
       │                    │                    │
       │                    │ Check session      │
       │                    │ exists in DB       │
       │                    │                    │
       │                    │ Check duplicate    │
       │                    │ attendance         │
       │                    │                    │
       │                    │ Save Attendance    │
       │                    │                    │
       │ 201 Created        │                    │
       │<───────────────────│                    │
```

---

## Configuration

### Feign Client Configuration

```java

@FeignClient(name = "user-service", path = "/api/v1/user")
public interface UserServiceClient {
    @GetMapping("/students/{studentId}/validate")
    StudentValidationResponse validateStudent(@PathVariable Long studentId);

    @GetMapping("/students/{studentId}/details")
    StudentDetailsResponse getStudentDetails(@PathVariable Long studentId);
}

@FeignClient(name = "enrollment-service")
public interface EnrollmentServiceClient {
    @GetMapping("/api/v1/course-registration/{id}/validate")
    Boolean validateCourseRegistration(@PathVariable Long id);

    @GetMapping("/api/v1/course-offering/{id}/validate")
    Boolean validateCourseOffering(@PathVariable Long id);
}

@FeignClient(name = "facility-service", path = "/api/v1/classroom")
public interface FacilityServiceClient {
    @GetMapping("/validate/{classroomId}")
    ClassroomValidationResponse validateClassroom(@PathVariable Long classroomId);
}
```

**Configuration:**

- Connect timeout: 5 seconds
- Read timeout: 10 seconds
- Retry: 3 attempts with exponential backoff
- JWT token forwarding enabled

---

## Error Handling

### Feign Client Errors

| Scenario                       | Handling                              |
|--------------------------------|---------------------------------------|
| User Service unavailable       | Retry 3 times, then fail              |
| Enrollment Service unavailable | Retry 3 times, then fail              |
| Facility Service unavailable   | Retry 3 times, then fail              |
| Student not found (404)        | Throw StudentNotFoundException        |
| Invalid student role           | Throw InvalidStudentRoleException     |
| Registration not found         | Throw RegistrationNotFoundException   |
| Offering not found             | Throw CourseOfferingNotFoundException |
| Classroom not found            | Throw ClassroomNotFoundException      |

---

## Service Dependencies Summary

| Dependency             | Type  | Purpose                                   |
|------------------------|-------|-------------------------------------------|
| **Config Server**      | HTTP  | Configuration management                  |
| **Discovery (Eureka)** | HTTP  | Service registration                      |
| **User Service**       | Feign | Student validation and info               |
| **Enrollment Service** | Feign | Registration/offering validation and info |
| **Facility Service**   | Feign | Classroom validation and info             |
| **Academic Service**   | Feign | Course info                               |
| **MySQL**              | JDBC  | Primary data storage                      |

### Not Dependent By

The Assessment Service is a leaf node in the service dependency graph - no other business services depend on it.

---

## Database Entities

### Session

- Links CourseOffering (Enrollment) with Classroom (Facility)
- **Unique Constraint:** `(classroom_id, start_time, end_time)`

### Attendance

- Links Student (User) with Session
- **Unique Constraint:** `(student_id, session_id)`

### Grade

- Links to CourseRegistration (Enrollment)
- **Unique Constraint:** `(course_registration_id, grade_type)`

---

## Monitoring

### Key Metrics

- Feign client success/failure rates per target service
- Grade entry rates
- Attendance tracking rates
- Session creation rates

### Health Endpoints

| Endpoint                 | Description            |
|--------------------------|------------------------|
| `/actuator/health`       | Overall service health |
| `/actuator/health/db`    | Database connectivity  |
| `/actuator/health/feign` | Feign client status    |

---

## Data Consistency Considerations

### Cross-Service Data

Since Assessment Service references data from multiple services:

1. **Student Deletion:** If a student is deleted in User Service, their attendance and grade records remain (soft
   reference by ID)

2. **Course Registration Deletion:** If a registration is deleted in Enrollment Service, associated grades remain
   orphaned

3. **Session Deletion:** Session cannot be deleted if attendance records exist (hard constraint)

### Recommendations

- Implement event-driven cleanup for orphaned records
- Add periodic reconciliation jobs
- Consider soft deletes for audit trail
