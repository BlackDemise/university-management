# 🎓 University Management System

A comprehensive microservices-based university management system built with Spring Boot 3.5, Spring Cloud 2025.0.0, and
React.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
    - [Option 1: Docker Compose (Recommended)](#option-1-docker-compose-recommended)
    - [Option 2: Manual Setup (Development)](#option-2-manual-setup-development)
- [Service Ports](#service-ports)
- [Default Credentials](#default-credentials)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

---

## Overview

This system manages university operations including:

- **User Management**: Students, Teachers, Administrative staff with role-based access
- **Academic Management**: Departments, Majors, Courses, Prerequisites, Program Curricula
- **Enrollment Management**: Semesters, Course Offerings, Course Registrations
- **Assessment Management**: Sessions (Schedules), Attendance, Grades
- **Facility Management**: Classroom management
- **Media Management**: File storage (Local & Google Cloud Storage)

---

## Architecture

```
                                    ┌─────────────────┐
                                    │    Frontend     │
                                    │   (React/Vite)  │
                                    │   Port: 5173    │
                                    └────────┬────────┘
                                             │
                                             ▼
┌─────────────────┐              ┌─────────────────────┐
│  Config Server  │◄────────────│    API Gateway      │
│   Port: 8888    │              │    Port: 8222       │
└─────────────────┘              └──────────┬──────────┘
                                            │
         ┌──────────────────────────────────┼──────────────────────────────────┐
         │                    │             │             │                    │
         ▼                    ▼             ▼             ▼                    ▼
┌─────────────────┐  ┌─────────────┐ ┌───────────┐ ┌────────────┐  ┌─────────────────┐
│  Auth Service   │  │User Service │ │ Academic  │ │ Enrollment │  │   Assessment    │
│   Port: 8000    │  │ Port: 8001  │ │Port: 8002 │ │ Port: 8004 │  │   Port: 8005    │
└────────┬────────┘  └──────┬──────┘ └─────┬─────┘ └─────┬──────┘  └────────┬────────┘
         │                  │              │             │                  │
         │                  │              │             │                  │
         │                  └──────────────┼─────────────┼──────────────────┤
         │                                 │             │                  │
         ▼                    ┌────────────┴────────────┬┴──────────────────┘
┌─────────────────┐           │                         │
│     Kafka       │◄──────────┤                         ▼
│   Port: 9092    │           │              ┌─────────────────┐
└─────────────────┘           │              │ Facility Service│
                              │              │   Port: 8003    │
                              ▼              └─────────────────┘
                   ┌─────────────────┐
                   │  Media Service  │
                   │   Port: 8006    │
                   └─────────────────┘
                              │
         ┌────────────────────┴────────────────────┐
         ▼                                         ▼
┌─────────────────┐                     ┌─────────────────┐
│   MySQL 8.0     │                     │ Discovery/Eureka│
│   Port: 3306    │                     │   Port: 8761    │
└─────────────────┘                     └─────────────────┘
```

---

## Tech Stack

| Layer                 | Technology                                        |
|-----------------------|---------------------------------------------------|
| **Backend**           | Java 17, Spring Boot 3.5.0, Spring Cloud 2025.0.0 |
| **Frontend**          | React 18, Vite, JavaScript                        |
| **Database**          | MySQL 8.0                                         |
| **Message Broker**    | Apache Kafka                                      |
| **Service Discovery** | Netflix Eureka                                    |
| **API Gateway**       | Spring Cloud Gateway                              |
| **Configuration**     | Spring Cloud Config Server                        |
| **File Storage**      | Google Cloud Storage / Local filesystem           |
| **Containerization**  | Docker, Docker Compose                            |

---

## Prerequisites

### For Docker Setup (Recommended)

- **Docker Desktop** 4.0+ with Docker Compose V2
- **RAM**: Minimum 8GB available for Docker
- **Disk Space**: Minimum 10GB free

### For Manual Development Setup

- **Java 17** (Eclipse Temurin recommended)
- **Maven 3.8+** (or use included Maven wrapper `./mvnw`)
- **Node.js 18+** and npm
- **MySQL 8.0**
- **Apache Kafka** (with Zookeeper)
- **IDE**: IntelliJ IDEA or VS Code with Java extensions

---

## Getting Started

### Option 1: Docker Compose (Recommended)

This is the easiest way to run the entire system.

#### Step 1: Clone and Navigate

```bash
cd university-management
```

#### Step 2: Start All Services

```powershell
# Build and start all containers (first run takes ~10-15 minutes)
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

#### Step 3: Verify Services

Wait for all services to become healthy. You can check status with:

```powershell
docker-compose ps
```

All services should show `healthy` status. This may take 3-5 minutes after startup.

#### Step 4: Access the Application

| Service              | URL                   |
|----------------------|-----------------------|
| **Frontend**         | http://localhost:5173 |
| **API Gateway**      | http://localhost:8222 |
| **Eureka Dashboard** | http://localhost:8761 |
| **Config Server**    | http://localhost:8888 |

#### Step 5: Stopping Services

```powershell
# Stop all services (preserves data)
docker-compose down

# Stop and remove all data (clean reset)
docker-compose down -v
```

#### Viewing Logs

```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f auth-service
docker-compose logs -f user-service
docker-compose logs -f gateway-service
```

---

### Option 2: Manual Setup (Development)

Use this option for local development when you need to debug or modify services.

#### Step 1: Start Infrastructure Services

**Start MySQL:**

```powershell
# Using Docker for MySQL
docker run -d --name mysql-db `
  -e MYSQL_ROOT_PASSWORD=root `
  -p 3306:3306 `
  mysql:8.0.41

# Wait for MySQL to be ready, then create databases
docker exec -i mysql-db mysql -uroot -proot -e "
CREATE DATABASE IF NOT EXISTS auth_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS user_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS academic_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS facility_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS enrollment_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS assessment_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
"
```

**Start Kafka & Zookeeper:**

```powershell
# Using Docker for Kafka stack
docker run -d --name zookeeper `
  -e ZOOKEEPER_CLIENT_PORT=2181 `
  -p 2181:2181 `
  confluentinc/cp-zookeeper:latest

docker run -d --name kafka `
  -e KAFKA_BROKER_ID=1 `
  -e KAFKA_ZOOKEEPER_CONNECT=host.docker.internal:2181 `
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 `
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 `
  -p 9092:9092 `
  confluentinc/cp-kafka:7.3.3
```

#### Step 2: Start Microservices (In Order)

**Important**: Services must be started in this specific order due to dependencies.

Open a separate terminal for each service:

**Terminal 1 - Config Server (Start First):**

```powershell
cd services/config-server
./mvnw spring-boot:run
# Wait until you see "Started ConfigServerApplication"
```

**Terminal 2 - Discovery Service (Eureka):**

```powershell
cd services/discovery
./mvnw spring-boot:run
# Wait until healthy, check http://localhost:8761
```

**Terminal 3 - Auth Service:**

```powershell
cd services/auth
./mvnw spring-boot:run
```

**Terminal 4 - User Service:**

```powershell
cd services/user
./mvnw spring-boot:run
```

**Terminal 5 - Academic Service:**

```powershell
cd services/academic
./mvnw spring-boot:run
```

**Terminal 6 - Facility Service:**

```powershell
cd services/facility
./mvnw spring-boot:run
```

**Terminal 7 - Media Service:**

```powershell
cd services/media
./mvnw spring-boot:run
```

**Terminal 8 - Enrollment Service:**

```powershell
cd services/enrollment
./mvnw spring-boot:run
```

**Terminal 9 - Assessment Service:**

```powershell
cd services/assessment
./mvnw spring-boot:run
```

**Terminal 10 - Gateway Service (Start Last):**

```powershell
cd services/gateway
./mvnw spring-boot:run
```

#### Step 3: Start Frontend (Optional)

```powershell
cd frontend
npm install
npm run dev
```

---

## Service Ports

| Service                | Port | Description                                |
|------------------------|------|--------------------------------------------|
| **Config Server**      | 8888 | Centralized configuration management       |
| **Discovery (Eureka)** | 8761 | Service registry and discovery             |
| **Gateway**            | 8222 | API Gateway - Single entry point           |
| **Auth Service**       | 8000 | Authentication & JWT management            |
| **User Service**       | 8001 | User, Teacher, Student management          |
| **Academic Service**   | 8002 | Departments, Majors, Courses               |
| **Facility Service**   | 8003 | Classroom management                       |
| **Enrollment Service** | 8004 | Semesters, Course Offerings, Registrations |
| **Assessment Service** | 8005 | Sessions, Attendance, Grades               |
| **Media Service**      | 8006 | File storage (GCS/Local)                   |
| **MySQL**              | 3306 | Database                                   |
| **Kafka**              | 9092 | Message broker                             |
| **Zookeeper**          | 2181 | Kafka coordinator                          |
| **Frontend**           | 5173 | React development server                   |

---

## Default Credentials

### MySQL Database

| Property | Value     |
|----------|-----------|
| Host     | localhost |
| Port     | 3306      |
| Username | root      |
| Password | root      |

### Application

Initial user credentials need to be created via API or database seeding. The system uses JWT-based authentication.

---

## API Documentation

All APIs are accessible through the Gateway at `http://localhost:8222`.

Detailed API documentation is available in:

- [documents/api/](documents/api/) - API lists and integration docs for each service

### Quick API Reference

| Service    | Base Path                                                                    | Description                  |
|------------|------------------------------------------------------------------------------|------------------------------|
| Auth       | `/api/v1/auth`                                                               | Login, logout, token refresh |
| User       | `/api/v1/user`, `/api/v1/role`                                               | User CRUD, roles             |
| Academic   | `/api/v1/department`, `/api/v1/major`, `/api/v1/course`, etc.                | Academic entities            |
| Facility   | `/api/v1/classroom`                                                          | Classroom management         |
| Enrollment | `/api/v1/semester`, `/api/v1/course-offering`, `/api/v1/course-registration` | Enrollment management        |
| Assessment | `/api/v1/session`, `/api/v1/attendance`, `/api/v1/grade`                     | Assessment management        |
| Media      | `/api/v1/gcs`, `/api/v1/files`                                               | File storage                 |

---

## Troubleshooting

### Services Won't Start

**Check if ports are in use:**

```powershell
netstat -ano | findstr "8888 8761 8000 8001 8002"
```

**Check Docker container health:**

```powershell
docker-compose ps
docker-compose logs <service-name>
```

### Database Connection Issues

**Verify MySQL is running:**

```powershell
docker exec -it mysql-db mysql -uroot -proot -e "SHOW DATABASES;"
```

**Check database creation:**

```sql
SHOW
DATABASES;
-- Should show: auth_service, user_service, academic_service, 
--              facility_service, enrollment_service, assessment_service
```

### Kafka Issues

**Check Kafka topics:**

```powershell
docker exec -it kafka kafka-topics --bootstrap-server localhost:9092 --list
```

### Service Discovery Issues

**Verify services are registered:**

1. Open http://localhost:8761
2. Check "Instances currently registered with Eureka"
3. All services should be listed

### Config Server Issues

**Test config server is serving configs:**

```powershell
curl http://localhost:8888/auth-service/dev
```

### Memory Issues

If services are slow or crashing:

```powershell
# Increase Docker memory (Docker Desktop Settings → Resources)
# Recommended: 8GB RAM minimum

# Or start fewer services at once
docker-compose up -d mysql-db zookeeper kafka
docker-compose up -d config-server discovery-service
docker-compose up -d auth-service user-service
# ... continue with other services
```

### Clean Restart

```powershell
# Nuclear option - removes all containers, networks, and volumes
docker-compose down -v
docker system prune -a -f
docker-compose up --build
```

---

## Project Structure

```
university-management/
├── docker-compose.yml          # Docker orchestration
├── docker-compose.env          # Environment variables
├── Dockerfile                  # Shared dependency builder
├── README.md                   # This file
├── docker/
│   ├── mysql/init-scripts/     # Database initialization
│   └── README.md               # Docker-specific docs
├── documents/
│   └── api/                    # API documentation
├── frontend/                   # React frontend
└── services/
    ├── academic/               # Academic Service
    ├── assessment/             # Assessment Service
    ├── auth/                   # Auth Service
    ├── config-server/          # Config Server
    ├── discovery/              # Eureka Discovery
    ├── enrollment/             # Enrollment Service
    ├── facility/               # Facility Service
    ├── gateway/                # API Gateway
    ├── media/                  # Media Service
    └── user/                   # User Service
```

---

## Next Steps After Setup

1. ✅ Verify all services are running (check Eureka dashboard)
2. ✅ Access frontend at http://localhost:5173
3. 📝 Create initial admin user via API
4. 🔐 Login and explore the system
5. 📚 Read API documentation in `documents/api/`

---