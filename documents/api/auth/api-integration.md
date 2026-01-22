# Auth Service - API Integration Documentation

## Overview

The Auth Service is a **consumer-only** service in terms of synchronous communication. It does not make REST calls to
other services but **receives data asynchronously via Kafka** from the User Service.

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            AUTH SERVICE                                  │
│                             (Port 8000)                                  │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                          ┌─────────┴─────────┐
                          │                   │
                          ▼                   ▼
               ┌──────────────────┐  ┌──────────────────┐
               │   KAFKA TOPIC    │  │    EUREKA        │
               │  "user-events"   │  │   DISCOVERY      │
               └────────┬─────────┘  └──────────────────┘
                        │
                        │ Consumes
                        │
               ┌────────┴─────────┐
               │   USER SERVICE   │
               │   (Port 8001)    │
               │   (Producer)     │
               └──────────────────┘
```

---

## Inbound Integrations

### Kafka Consumer: User Events

The Auth Service consumes user lifecycle events from the User Service to maintain synchronized authentication data.

#### Topic: `user-events`

**Consumer Group ID:** `auth-service-group`

#### Event Structure: UserEvent

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

#### Event Handling Logic

| Event Type | Action          | Description                                                                   |
|------------|-----------------|-------------------------------------------------------------------------------|
| `CREATE`   | Create AuthUser | Creates a new AuthUser record with email, hashed password, role, and fullName |
| `UPDATE`   | Update AuthUser | Updates existing AuthUser's password and/or role                              |
| `DELETE`   | Delete AuthUser | Removes AuthUser by email (effectively disabling login)                       |

#### Consumer Implementation

Located in: `org.endipi.auth.consumer.UserEventConsumer`

```java

@KafkaListener(topics = "${kafka.topic.user-events}",
        groupId = "${kafka.group-id.auth-service}")
public void consumeUserEvent(UserEvent event) {
    switch (event.getEventType()) {
        case "CREATE" -> createAuthUser(event);
        case "UPDATE" -> updateAuthUser(event);
        case "DELETE" -> deleteAuthUser(event);
    }
}
```

---

## Outbound Integrations

### REST APIs

**None** - The Auth Service does not make outbound REST calls to other services.

### Kafka Producer

**None** - The Auth Service does not produce Kafka events.

---

## Service Dependencies

| Dependency                    | Type                 | Purpose                                |
|-------------------------------|----------------------|----------------------------------------|
| **Config Server**             | REST (Config Client) | Fetches configuration at startup       |
| **Discovery Server (Eureka)** | REST (Eureka Client) | Registers for service discovery        |
| **Kafka**                     | Message Broker       | Consumes user events                   |
| **MySQL**                     | Database             | Stores auth_user and blacklisted_token |

---

## Database Entities

### AuthUser Table

Stores authentication credentials synchronized from User Service.

| Column       | Type         | Description                         |
|--------------|--------------|-------------------------------------|
| `id`         | BIGINT       | Primary key (auto-generated)        |
| `email`      | VARCHAR(255) | Unique, used as username            |
| `password`   | VARCHAR(255) | BCrypt hashed password              |
| `role`       | VARCHAR(50)  | User role (ADMIN, TEACHER, STUDENT) |
| `full_name`  | VARCHAR(255) | User's display name                 |
| `created_at` | TIMESTAMP    | Creation timestamp                  |

### BlacklistedToken Table

Stores invalidated tokens to prevent reuse.

| Column        | Type         | Description            |
|---------------|--------------|------------------------|
| `id`          | BIGINT       | Primary key            |
| `token`       | VARCHAR(500) | The invalidated JWT    |
| `token_type`  | ENUM         | ACCESS or REFRESH      |
| `expiry_date` | TIMESTAMP    | When the token expires |

---

## Data Flow Examples

### User Creation Flow

```
┌──────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│ Admin creates│     │ User Service │     │   Kafka     │     │ Auth Service │
│  new user    │     │              │     │             │     │              │
└──────┬───────┘     └──────┬───────┘     └──────┬──────┘     └──────┬───────┘
       │                    │                    │                    │
       │ POST /api/v1/user  │                    │                    │
       │───────────────────>│                    │                    │
       │                    │                    │                    │
       │                    │ Publish CREATE     │                    │
       │                    │ event              │                    │
       │                    │───────────────────>│                    │
       │                    │                    │                    │
       │                    │                    │ Consume event      │
       │                    │                    │───────────────────>│
       │                    │                    │                    │
       │                    │                    │                    │ Create AuthUser
       │                    │                    │                    │ in database
       │                    │                    │                    │
       │ 201 Created        │                    │                    │
       │<───────────────────│                    │                    │
```

### Login Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Client    │     │   Gateway    │     │ Auth Service │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │ POST /api/v1/auth/login                 │
       │───────────────────>│                    │
       │                    │                    │
       │                    │ Route to AUTH-SERVICE
       │                    │───────────────────>│
       │                    │                    │
       │                    │                    │ Validate credentials
       │                    │                    │ Generate JWT tokens
       │                    │                    │
       │                    │ 200 OK + tokens    │
       │                    │<───────────────────│
       │                    │                    │
       │ 200 OK             │                    │
       │ accessToken in body│                    │
       │ refreshToken cookie│                    │
       │<───────────────────│                    │
```

---

## Configuration

### Kafka Configuration

```yaml
kafka:
  bootstrap-servers: localhost:9092
  topic:
    user-events: user-events
  group-id:
    auth-service: auth-service-group
```

### JWT Configuration

```yaml
jwt:
  secret: ${JWT_SECRET_KEY}
  access-token-expiration: 900000    # 15 minutes
  refresh-token-expiration: 604800000 # 7 days
```

---

## Error Handling

### Kafka Consumer Errors

| Scenario                        | Handling                               |
|---------------------------------|----------------------------------------|
| Malformed event                 | Log error, skip message                |
| Database error                  | Retry up to 3 times, then log and skip |
| Duplicate email on CREATE       | Update existing record instead         |
| User not found on UPDATE/DELETE | Log warning, skip message              |

---

## Monitoring

### Key Metrics

- Kafka consumer lag (messages pending processing)
- Login success/failure rate
- Token refresh rate
- Blacklisted tokens count

### Health Endpoints

| Endpoint                 | Description            |
|--------------------------|------------------------|
| `/actuator/health`       | Overall service health |
| `/actuator/health/db`    | Database connectivity  |
| `/actuator/health/kafka` | Kafka consumer health  |
