# Academic Service - API Integration Documentation

## Overview

The Academic Service manages academic entities (departments, majors, courses, curricula). It integrates with the User
Service to validate and retrieve teacher information, and consumes Kafka events for cleanup operations.

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ACADEMIC SERVICE                                   │
│                            (Port 8002)                                       │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────────────┐
                    │                                       │
                    ▼                                       ▼
         ┌──────────────────┐                    ┌──────────────────┐
         │   USER SERVICE   │                    │      KAFKA       │
         │   (Port 8001)    │                    │   (Port 9092)    │
         │                  │                    │                  │
         │ Feign Client:    │                    │ Consumes:        │
         │ - Validate teacher│                   │ - teacher-events │
         │ - Get all teachers│                   │                  │
         │ - Get teacher info│                   │                  │
         └──────────────────┘                    └────────┬─────────┘
                                                          │
                                                          │ Produces
                                                          │
                                               ┌──────────┴─────────┐
                                               │   USER SERVICE     │
                                               │   (Port 8001)      │
                                               └────────────────────┘
```

---

## Outbound Integrations (Academic Service → Other Services)

### Feign Client: User Service

**Client:** `UserServiceClient`  
**Target Service:** `user-service`  
**Base Path:** `/api/v1/user`

| Method | Endpoint                         | Purpose                                          | Response                    |
|--------|----------------------------------|--------------------------------------------------|-----------------------------|
| `GET`  | `/teachers/{teacherId}/validate` | Validate teacher exists and has TEACHER role     | `TeacherValidationResponse` |
| `GET`  | `/s2s/teacher/all`               | Get all teachers for department member selection | `List<TeacherResponse>`     |
| `GET`  | `/teachers/{teacherId}/details`  | Get teacher details for display                  | `TeacherResponse`           |

#### TeacherValidationResponse

```json
{
  "isExist": true,
  "isTeacher": true
}
```

#### Usage Scenarios

1. **Adding Department Member:**
    - Before adding a teacher to a department, validate they exist and have TEACHER role
    - If validation fails, reject the operation

2. **Listing Available Teachers:**
    - When showing teachers available for assignment, fetch all teachers from User Service
    - Filter out teachers already assigned to the department

3. **Displaying Department Member Details:**
    - When showing department members, fetch teacher details (name, code, etc.)

---

### Feign Configuration

```java

@FeignClient(name = "user-service", path = "/api/v1/user")
public interface UserServiceClient {

    @GetMapping("/teachers/{teacherId}/validate")
    TeacherValidationResponse validateTeacher(@PathVariable Long teacherId);

    @GetMapping("/s2s/teacher/all")
    List<TeacherResponse> getAllTeachers();

    @GetMapping("/teachers/{teacherId}/details")
    TeacherResponse getTeacherDetails(@PathVariable Long teacherId);
}
```

**Configuration:**

- Connect timeout: 5 seconds
- Read timeout: 10 seconds
- Retry: 3 attempts with exponential backoff (100ms → 1s)
- JWT token forwarding enabled via `JwtRequestInterceptor`

---

## Inbound Integrations (Other Services → Academic Service)

### Kafka Consumer: Teacher Events

**Topic:** `teacher-events`  
**Consumer Group ID:** `academic-service-group`

The Academic Service consumes teacher events from the User Service to clean up department memberships when teachers are
deleted or their role changes.

#### Event Types

| Event Type             | Action                 | Description                         |
|------------------------|------------------------|-------------------------------------|
| `TEACHER_REMOVED`      | Delete all memberships | When a teacher user is deleted      |
| `TEACHER_ROLE_REMOVED` | Delete all memberships | When user role changes from TEACHER |

#### TeacherEvent Payload

```json
{
  "eventType": "TEACHER_REMOVED | TEACHER_ROLE_REMOVED",
  "userId": 123,
  "teacherId": 456,
  "email": "teacher@example.com",
  "fullName": "Teacher Name",
  "teacherCode": "GV001",
  "timestamp": 1705920000000
}
```

#### Consumer Implementation

```java

@KafkaListener(topics = "${kafka.topic.teacher-events}",
        groupId = "${kafka.group-id.academic-service}")
public void consumeTeacherEvent(TeacherEvent event) {
    if ("TEACHER_REMOVED".equals(event.getEventType())
            || "TEACHER_ROLE_REMOVED".equals(event.getEventType())) {
        departmentMemberService.deleteAllByTeacherId(event.getTeacherId());
    }
}
```

---

### S2S API Consumers

The following services call Academic Service APIs:

#### 1. User Service

| Endpoint Called                    | Purpose                                       |
|------------------------------------|-----------------------------------------------|
| `/api/v1/major/{majorId}/validate` | Validate major exists before creating student |

#### 2. Enrollment Service

| Endpoint Called                         | Purpose                             |
|-----------------------------------------|-------------------------------------|
| `/api/v1/course/{courseId}/validate`    | Validate course for course offering |
| `/api/v1/course/{courseId}/details`     | Get course details for display      |
| `/api/v1/course/s2s/all`                | Get all courses                     |
| `/api/v1/course/s2s/names?ids=...`      | Batch get course names              |
| `/api/v1/course/s2s/basic-info?ids=...` | Batch get course info               |

#### 3. Assessment Service

| Endpoint Called                            | Purpose                             |
|--------------------------------------------|-------------------------------------|
| `/api/v1/course/s2s/basic-info/v1?ids=...` | Get course info for session display |

---

## Data Flow Examples

### 1. Add Teacher to Department Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Admin     │     │   Academic   │     │ User Service │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │ POST /department-  │                    │
       │ member             │                    │
       │ {teacherId: 1}     │                    │
       │───────────────────>│                    │
       │                    │                    │
       │                    │ Validate teacher   │
       │                    │───────────────────>│
       │                    │                    │
       │                    │ {isExist: true,    │
       │                    │  isTeacher: true}  │
       │                    │<───────────────────│
       │                    │                    │
       │                    │ Save DeptMember    │
       │                    │                    │
       │ 201 Created        │                    │
       │<───────────────────│                    │
```

### 2. Teacher Deletion Cleanup Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Admin     │     │ User Service │     │    Kafka     │     │   Academic   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │                    │
       │ DELETE /user/1     │                    │                    │
       │ (teacher user)     │                    │                    │
       │───────────────────>│                    │                    │
       │                    │                    │                    │
       │                    │ Publish TEACHER_   │                    │
       │                    │ REMOVED event      │                    │
       │                    │───────────────────>│                    │
       │                    │                    │                    │
       │                    │                    │ Consume event      │
       │                    │                    │───────────────────>│
       │                    │                    │                    │
       │                    │                    │                    │ Delete all
       │                    │                    │                    │ DeptMembers
       │                    │                    │                    │ for teacherId
       │                    │                    │                    │
       │ 200 OK             │                    │                    │
       │<───────────────────│                    │                    │
```

### 3. Course Offering Creation (Enrollment → Academic)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Admin     │     │  Enrollment  │     │   Academic   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │ POST /course-      │                    │
       │ offering           │                    │
       │ {courseId: 1}      │                    │
       │───────────────────>│                    │
       │                    │                    │
       │                    │ Validate course    │
       │                    │───────────────────>│
       │                    │                    │
       │                    │ true               │
       │                    │<───────────────────│
       │                    │                    │
       │                    │ Save offering      │
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

### Kafka Consumer Configuration

```yaml
kafka:
  bootstrap-servers: localhost:9092
  topic:
    teacher-events: teacher-events
  group-id:
    academic-service: academic-service-group
```

---

## Error Handling

### Feign Client Errors

| Scenario                            | Handling                                              |
|-------------------------------------|-------------------------------------------------------|
| User Service unavailable            | Retry 3 times, then throw ServiceUnavailableException |
| Teacher not found (404)             | Throw TeacherNotFoundException                        |
| Teacher exists but not TEACHER role | Throw InvalidTeacherRoleException                     |
| Timeout                             | Fail after 10 seconds                                 |

### Kafka Consumer Errors

| Scenario                        | Handling                               |
|---------------------------------|----------------------------------------|
| Malformed event                 | Log error, skip message                |
| Teacher not found in DeptMember | Log warning, skip (already cleaned up) |
| Database error                  | Retry up to 3 times                    |

---

## Service Dependencies Summary

| Dependency             | Type     | Purpose                     |
|------------------------|----------|-----------------------------|
| **Config Server**      | HTTP     | Configuration management    |
| **Discovery (Eureka)** | HTTP     | Service registration        |
| **User Service**       | Feign    | Teacher validation and info |
| **MySQL**              | JDBC     | Primary data storage        |
| **Kafka**              | Consumer | Teacher event cleanup       |

---

## Database Entities

### Department

- Primary entity for academic units
- Referenced by: Major, DepartmentMember

### Major

- Belongs to Department
- Referenced by: Student (User Service), ProgramCurriculum

### Course

- Standalone entity
- Referenced by: PrerequisiteCourse, ProgramCurriculum, CourseOffering (Enrollment)

### DepartmentMember

- Links Department with Teacher (User Service)
- Tracks role and duration of assignment

### PrerequisiteCourse

- Self-referential through Course
- Enforces course dependencies

### ProgramCurriculum

- Links Major with Course
- Defines required courses per major

---

## Monitoring

### Key Metrics

- Feign client success/failure rates
- Kafka consumer lag
- Department member count per department
- Course prerequisite chain depth

### Health Endpoints

| Endpoint                 | Description            |
|--------------------------|------------------------|
| `/actuator/health`       | Overall service health |
| `/actuator/health/db`    | Database connectivity  |
| `/actuator/health/kafka` | Kafka consumer health  |
