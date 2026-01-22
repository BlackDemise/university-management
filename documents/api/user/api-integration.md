# User Service - API Integration Documentation

## Overview

The User Service is a central service that manages users, teachers, and students. It integrates with multiple services
both as a **consumer** (calling other services) and as a **producer** (publishing events for other services).

---

## Integration Architecture

```
                                    ┌─────────────────────────────┐
                                    │       USER SERVICE          │
                                    │        (Port 8001)          │
                                    └──────────────┬──────────────┘
                                                   │
                    ┌──────────────────────────────┼──────────────────────────────┐
                    │                              │                              │
                    ▼                              ▼                              ▼
         ┌──────────────────┐           ┌──────────────────┐           ┌──────────────────┐
         │  ACADEMIC SERVICE │           │   MEDIA SERVICE  │           │      KAFKA       │
         │    (Port 8002)    │           │    (Port 8006)   │           │   (Port 9092)    │
         │                   │           │                  │           │                  │
         │ Major validation  │           │ Avatar upload    │           │ Produces:        │
         │ (Feign Client)    │           │ Signed URL       │           │ - user-events    │
         └──────────────────┘           │ (Feign Client)   │           │ - teacher-events │
                                        └──────────────────┘           └────────┬─────────┘
                                                                                │
                                                         ┌──────────────────────┴────────┐
                                                         │                               │
                                                         ▼                               ▼
                                              ┌──────────────────┐            ┌──────────────────┐
                                              │   AUTH SERVICE   │            │ ACADEMIC SERVICE │
                                              │   (Port 8000)    │            │   (Port 8002)    │
                                              │                  │            │                  │
                                              │ Consumes:        │            │ Consumes:        │
                                              │ user-events      │            │ teacher-events   │
                                              └──────────────────┘            └──────────────────┘
```

---

## Outbound Integrations (User Service → Other Services)

### 1. Feign Client: Academic Service

**Client:** `MajorServiceClient`  
**Target Service:** `academic-service`  
**Base Path:** `/api/v1/major`

| Method | Endpoint              | Purpose                                       | Response  |
|--------|-----------------------|-----------------------------------------------|-----------|
| `GET`  | `/{majorId}/validate` | Validate major exists before creating student | `Boolean` |

**Usage:** When creating a student user with a `majorId`, the service validates that the major exists in the Academic
Service.

**Configuration:**

```java

@FeignClient(name = "academic-service", path = "/api/v1/major")
public interface MajorServiceClient {
    @GetMapping("/{majorId}/validate")
    Boolean validateMajorExists(@PathVariable Long majorId);
}
```

---

### 2. Feign Client: Media Service

**Client:** `MediaServiceClient`  
**Target Service:** `media-service`  
**Base Path:** `/api/v1/gcs`

| Method | Endpoint                 | Purpose                   | Response              |
|--------|--------------------------|---------------------------|-----------------------|
| `POST` | `/upload`                | Upload user avatar        | `String` (signed URL) |
| `GET`  | `/signed-url/{fileName}` | Get signed URL for avatar | `String` (signed URL) |

**Usage:**

- When uploading a user avatar, the file is sent to Media Service for storage in Google Cloud Storage
- When retrieving user data, signed URLs are generated for avatar access

**Avatar Filename Format:** `avatars/{userId}_{originalFilename}`

---

### 3. Kafka Producer: User Events

**Topic:** `user-events` (configured via Config Server)  
**Producer:** `UserEventProducer`

#### Event Types

| Event Type | Trigger                             | Description                                 |
|------------|-------------------------------------|---------------------------------------------|
| `CREATE`   | New user created                    | Notifies Auth Service to create credentials |
| `UPDATE`   | User updated (password/role change) | Notifies Auth Service to update credentials |
| `DELETE`   | User deleted                        | Notifies Auth Service to remove credentials |

#### UserEvent Payload

```json
{
  "eventType": "CREATE | UPDATE | DELETE",
  "userId": 123,
  "email": "user@example.com",
  "password": "hashedPasswordString",
  "role": "ADMIN | TEACHER | STUDENT",
  "fullName": "User Full Name",
  "timestamp": 1705920000000
}
```

**Consumer:** Auth Service (creates/updates/deletes AuthUser records)

---

### 4. Kafka Producer: Teacher Events

**Topic:** `teacher-events` (configured via Config Server)  
**Producer:** `TeacherEventProducer`

#### Event Types

| Event Type             | Trigger                        | Description                                       |
|------------------------|--------------------------------|---------------------------------------------------|
| `TEACHER_REMOVED`      | Teacher user deleted           | Notifies Academic Service to clean up memberships |
| `TEACHER_ROLE_REMOVED` | User role changed from TEACHER | Notifies Academic Service to clean up memberships |

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

**Consumer:** Academic Service (removes DepartmentMember records for the teacher)

---

## Inbound Integrations (Other Services → User Service)

### S2S API Consumers

The following services call User Service APIs:

#### 1. Academic Service

| Endpoint Called                  | Purpose                                             |
|----------------------------------|-----------------------------------------------------|
| `/teachers/{teacherId}/validate` | Validate teacher exists before adding to department |
| `/s2s/teacher/all`               | Get all teachers for department member selection    |
| `/teachers/{teacherId}/details`  | Get teacher details for display                     |

#### 2. Enrollment Service

| Endpoint Called                  | Purpose                                  |
|----------------------------------|------------------------------------------|
| `/teachers/{teacherId}/validate` | Validate teacher for course offering     |
| `/students/{studentId}/validate` | Validate student for course registration |
| `/s2s/teachers/names`            | Get teacher names for display            |
| `/s2s/teachers/details`          | Get teacher details batch                |

#### 3. Assessment Service

| Endpoint Called                  | Purpose                                       |
|----------------------------------|-----------------------------------------------|
| `/students/{studentId}/validate` | Validate student for attendance/grade records |
| `/students/{studentId}/details`  | Get student details for display               |

---

## Data Flow Examples

### 1. Create Teacher User Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Admin     │     │ User Service │     │    Kafka     │     │ Auth Service │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │                    │
       │ POST /api/v1/user  │                    │                    │
       │ {role: "TEACHER"}  │                    │                    │
       │───────────────────>│                    │                    │
       │                    │                    │                    │
       │                    │ Save User + Teacher│                    │
       │                    │ Generate password  │                    │
       │                    │                    │                    │
       │                    │ Publish CREATE     │                    │
       │                    │ event (user-events)│                    │
       │                    │───────────────────>│                    │
       │                    │                    │                    │
       │                    │                    │ Consume event      │
       │                    │                    │───────────────────>│
       │                    │                    │                    │
       │                    │                    │                    │ Create AuthUser
       │                    │                    │                    │
       │ 201 Created        │                    │                    │
       │<───────────────────│                    │                    │
```

### 2. Delete Teacher User Flow (with cleanup)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Admin     │     │ User Service │     │    Kafka     │     │ Auth Service │     │  Academic    │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │                    │                    │
       │ DELETE /user/{id}  │                    │                    │                    │
       │───────────────────>│                    │                    │                    │
       │                    │                    │                    │                    │
       │                    │ Publish DELETE     │                    │                    │
       │                    │ (user-events)      │                    │                    │
       │                    │───────────────────>│ ─────────────────> │                    │
       │                    │                    │ Consume             │ Delete AuthUser    │
       │                    │                    │                    │                    │
       │                    │ Publish TEACHER_   │                    │                    │
       │                    │ REMOVED            │                    │                    │
       │                    │ (teacher-events)   │                    │                    │
       │                    │───────────────────>│ ──────────────────────────────────────> │
       │                    │                    │                    │ Consume             │
       │                    │                    │                    │ Remove dept members│
       │                    │                    │                    │                    │
       │                    │ Delete User        │                    │                    │
       │                    │                    │                    │                    │
       │ 200 OK             │                    │                    │                    │
       │<───────────────────│                    │                    │                    │
```

### 3. Create Student User Flow (with validation)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Admin     │     │ User Service │     │   Academic   │     │    Kafka     │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │                    │
       │ POST /api/v1/user  │                    │                    │
       │ {role: "STUDENT",  │                    │                    │
       │  majorId: 1}       │                    │                    │
       │───────────────────>│                    │                    │
       │                    │                    │                    │
       │                    │ Validate major     │                    │
       │                    │───────────────────>│                    │
       │                    │                    │                    │
       │                    │ {exists: true}     │                    │
       │                    │<───────────────────│                    │
       │                    │                    │                    │
       │                    │ Save User + Student│                    │
       │                    │                    │                    │
       │                    │ Publish CREATE     │                    │
       │                    │───────────────────────────────────────>│
       │                    │                    │                    │
       │ 201 Created        │                    │                    │
       │<───────────────────│                    │                    │
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
  circuitbreaker:
    enabled: true
```

### Kafka Producer Configuration

```yaml
kafka:
  bootstrap-servers: localhost:9092
  topic:
    user-events: user-events
    teacher-events: teacher-events
```

---

## Error Handling

### Feign Client Errors

| Scenario                  | Handling                                            |
|---------------------------|-----------------------------------------------------|
| Service unavailable       | Retry 3 times with exponential backoff (100ms → 1s) |
| Timeout                   | Fail after 10 seconds read timeout                  |
| 404 from Academic Service | Throw "Major not found" error                       |

### Kafka Producer Errors

| Scenario            | Handling                       |
|---------------------|--------------------------------|
| Kafka unavailable   | Retry with exponential backoff |
| Serialization error | Log error, operation continues |

---

## Service Dependencies Summary

| Dependency             | Type  | Purpose                    |
|------------------------|-------|----------------------------|
| **Config Server**      | HTTP  | Configuration management   |
| **Discovery (Eureka)** | HTTP  | Service registration       |
| **Academic Service**   | Feign | Major validation           |
| **Media Service**      | Feign | Avatar upload/retrieval    |
| **Auth Service**       | Kafka | Credential synchronization |
| **Academic Service**   | Kafka | Teacher membership cleanup |
| **MySQL**              | JDBC  | Primary data storage       |

---

## Monitoring

### Key Metrics

- User creation/update/deletion rates
- Feign client success/failure rates
- Kafka message production rates
- Avatar upload success rates

### Health Endpoints

| Endpoint                 | Description            |
|--------------------------|------------------------|
| `/actuator/health`       | Overall service health |
| `/actuator/health/db`    | Database connectivity  |
| `/actuator/health/feign` | Feign client status    |
