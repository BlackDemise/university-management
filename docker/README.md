# 🐳 University Management System - Docker Setup

This directory contains the Docker configuration for running the University Management microservices system.

## 📋 Prerequisites

- Docker Desktop 4.0+ 
- Docker Compose 2.0+
- At least 8GB RAM available for Docker
- At least 10GB free disk space

## 🚀 Quick Start

### 1. Build and Start All Services
```bash
# From the root directory
docker-compose up --build
```

### 2. Start in Background (Detached Mode)
```bash
docker-compose up -d --build
```

### 3. View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f auth-service
docker-compose logs -f user-service
```

### 4. Stop All Services
```bash
docker-compose down
```

### 5. Stop and Remove Volumes (Clean Reset)
```bash
docker-compose down -v
```

## 📊 Service URLs

| Service | URL | Port |
|---------|-----|------|
| Config Server | http://localhost:8888 | 8888 |
| Discovery Service | http://localhost:8761 | 8761 |
| Auth Service | http://localhost:8000 | 8000 |
| User Service | http://localhost:8001 | 8001 |
| MySQL Database | localhost:3306 | 3306 |
| Kafka | localhost:9092 | 9092 |

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Config Server │    │ Discovery Service│    │   MySQL DB      │
│   (Port: 8888)  │    │   (Port: 8761)   │    │   (Port: 3306)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Auth Service  │    │   User Service  │    │     Kafka       │
│   (Port: 8000)  │    │   (Port: 8001)  │    │   (Port: 9092)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Troubleshooting

### Services Won't Start
```bash
# Check service health
docker-compose ps

# View specific service logs
docker-compose logs auth-service

# Restart specific service
docker-compose restart auth-service
```

### Database Issues
```bash
# Check MySQL logs
docker-compose logs mysql-db

# Connect to MySQL
docker exec -it mysql-db mysql -u root -proot

# List databases
SHOW DATABASES;
```

### Network Issues
```bash
# Recreate network
docker-compose down
docker network prune
docker-compose up
```

### Clean Rebuild
```bash
# Remove all containers, networks, and volumes
docker-compose down -v
docker system prune -a

# Rebuild everything
docker-compose up --build
```

## 📝 Environment Variables

Environment variables are defined in `docker-compose.env`. You can modify them as needed:

- `MYSQL_ROOT_PASSWORD`: MySQL root password
- `SPRING_PROFILES_ACTIVE`: Spring profile (docker/dev/prod)
- `LOGGING_LEVEL_ORG_ENDIPI`: Application logging level

## 🏥 Health Checks

All services include health checks. You can monitor them:

```bash
# Check health status
docker-compose ps

# View health check logs
docker inspect <container_name> | grep -A 20 "Health"
```

## 🔒 Security Notes

- Default MySQL password is `root` (change for production)
- Services communicate within Docker network
- Expose only necessary ports to host

## 📈 Scaling Services

```bash
# Scale user service to 3 instances
docker-compose up --scale user-service=3

# Scale with load balancing (requires gateway)
docker-compose up --scale auth-service=2 --scale user-service=3
```

## 🚀 Production Deployment

For production deployment:

1. Use `docker-compose.prod.yml` override
2. Set proper environment variables
3. Use external databases
4. Enable SSL/TLS
5. Set up monitoring and logging

```bash
# Production deployment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
``` 