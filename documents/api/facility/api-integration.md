# Facility Service - API Integration Documentation

## Overview

The Facility Service is a **standalone resource service** that manages classroom data. It does not make outbound calls
to other services but provides S2S (Service-to-Service) endpoints for other services to consume.

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FACILITY SERVICE                                    │
│                           (Port 8003)                                        │
│                                                                              │
│                    ┌─────────────────────────┐                               │
│                    │   Classroom Resource    │                               │
│                    │   - CRUD endpoints      │                               │
│                    │   - S2S endpoints       │                               │
│                    └─────────────────────────┘                               │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    │ Provides APIs
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
         ┌──────────────────┐            ┌──────────────────┐
         │ASSESSMENT SERVICE│            │     GATEWAY      │
         │   (Port 8005)    │            │   (Port 8222)    │
         │                  │            │                  │
         │ Consumes via     │            │ Routes to        │
         │ Feign Client     │            │ /api/v1/classroom│
         └──────────────────┘            └──────────────────┘
```

---

## Outbound Integrations

### REST APIs

**None** - The Facility Service does not make outbound REST calls to other services.

### Kafka

**None** - The Facility Service does not produce or consume Kafka events.

---

## Inbound Integrations (Other Services → Facility Service)

### 1. Assessment Service (Feign Client)

The Assessment Service calls Facility Service to validate classrooms and retrieve classroom information for sessions.

**Feign Client:** `FacilityServiceClient`  
**Base Path:** `/api/v1/classroom`

| Method | Endpoint                                | Purpose                                           | Response                              |
|--------|-----------------------------------------|---------------------------------------------------|---------------------------------------|
| `GET`  | `/validate/{classroomId}`               | Validate classroom exists before creating session | `ClassroomValidationResponse`         |
| `GET`  | `/s2s/batch-details?classroomIds=1,2,3` | Get classroom details for multiple sessions       | `Map<Long, ClassroomDetailsResponse>` |
| `GET`  | `/s2s/all`                              | Get all classrooms for dropdown selection         | `List<ClassroomDetailsResponse>`      |

---

### 2. Gateway Service (Routing)

The Gateway routes all `/api/v1/classroom/**` requests to the Facility Service.

**Route Configuration:**

```yaml
routes:
  - id: facility-service
    uri: lb://FACILITY-SERVICE
    predicates:
      - Path=/api/v1/classroom/**
```

---

## Data Flow Examples

### 1. Session Creation (Assessment → Facility)

When creating a session, the Assessment Service validates the classroom:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Admin     │     │  Assessment  │     │   Facility   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │ POST /session      │                    │
       │ {classroomId: 1}   │                    │
       │───────────────────>│                    │
       │                    │                    │
       │                    │ Validate classroom │
       │                    │───────────────────>│
       │                    │                    │
       │                    │ {isExists: true,   │
       │                    │  classroomType:    │
       │                    │  "Phòng học..."}   │
       │                    │<───────────────────│
       │                    │                    │
       │                    │ Save Session       │
       │                    │                    │
       │ 201 Created        │                    │
       │<───────────────────│                    │
```

### 2. Session List with Classroom Details

When retrieving sessions with classroom information:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │     │  Assessment  │     │   Facility   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │ GET /session/      │                    │
       │ summary            │                    │
       │───────────────────>│                    │
       │                    │                    │
       │                    │ Get sessions from  │
       │                    │ database           │
       │                    │                    │
       │                    │ Batch get classroom│
       │                    │ details            │
       │                    │───────────────────>│
       │                    │                    │
       │                    │ {1: {name: "A101", │
       │                    │  type: "..."},     │
       │                    │  2: {...}}         │
       │                    │<───────────────────│
       │                    │                    │
       │                    │ Merge data         │
       │                    │                    │
       │ Sessions with      │                    │
       │ classroom info     │                    │
       │<───────────────────│                    │
```

---

## Service Dependencies Summary

| Dependency             | Type | Purpose                  |
|------------------------|------|--------------------------|
| **Config Server**      | HTTP | Configuration management |
| **Discovery (Eureka)** | HTTP | Service registration     |
| **MySQL**              | JDBC | Primary data storage     |

### No Dependencies On

- User Service
- Academic Service
- Enrollment Service
- Assessment Service
- Media Service
- Kafka

---

## Database Entity

### Classroom

| Column           | Type         | Constraints                 |
|------------------|--------------|-----------------------------|
| `id`             | BIGINT       | PRIMARY KEY, AUTO_INCREMENT |
| `room_number`    | VARCHAR(20)  | NOT NULL                    |
| `building`       | VARCHAR(100) | -                           |
| `capacity`       | INT          | -                           |
| `equipment`      | VARCHAR(500) | -                           |
| `classroom_type` | VARCHAR(20)  | ENUM                        |

**Unique Constraint:** `room_number` (within the system)

---

## Security Configuration

- **JWT Authentication:** All endpoints require valid JWT token
- **Authorization:** All CRUD endpoints require `ROLE_ADMIN`
- **S2S Endpoints:** Also protected by JWT (internal service tokens)
- **Public Endpoints:** Only `/actuator/health`

---

## Error Handling

### Response Format

All errors follow the standard ApiResponse format:

```json
{
  "timestamp": 1705920000000,
  "statusCode": 404,
  "message": "Không tìm thấy phòng học!"
}
```

### Error Scenarios

| Scenario                | HTTP Status | Message                       |
|-------------------------|-------------|-------------------------------|
| Classroom not found     | 404         | Không tìm thấy phòng học!     |
| Duplicate room number   | 409         | Room number already exists    |
| Invalid classroom type  | 400         | Invalid classroom type        |
| Concurrent modification | 409         | Retry failed after 3 attempts |

---

## Configuration

### Application Properties

```yaml
spring:
  application:
    name: facility-service
  datasource:
    url: jdbc:mysql://localhost:3306/facility_service
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
```

### Flyway Migrations

Database schema is managed via Flyway migrations located in:
`src/main/resources/db/migration/`

---

## Monitoring

### Health Endpoints

| Endpoint           | Description            |
|--------------------|------------------------|
| `/actuator/health` | Overall service health |
| `/actuator/info`   | Service information    |

### Key Metrics

- Total classroom count
- Classroom distribution by type (LECTURE_HALL vs LAB)
- API request rates
- Error rates

---

## Future Considerations

The Facility Service is designed to be expanded with:

1. **Maintenance Requests:** Track repair/maintenance needs
2. **Room Booking:** Reservation system for classrooms
3. **Equipment Tracking:** Detailed equipment inventory
4. **Building Management:** Multi-building support with location info
5. **Capacity Management:** Real-time occupancy tracking
