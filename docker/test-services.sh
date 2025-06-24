#!/bin/bash

# =============================================================================
# University Management System - Service Health Check Script
# =============================================================================

echo "🏥 University Management System - Health Check"
echo "=============================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if service is responding
check_service() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Checking $service_name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ OK${NC} (HTTP $response)"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC} (HTTP $response)"
        return 1
    fi
}

# Wait for services to start
echo "⏳ Waiting 30 seconds for services to initialize..."
sleep 30

echo ""
echo "🔍 Checking Infrastructure Services:"
echo "-----------------------------------"

# Check MySQL
echo -n "Checking MySQL Database... "
if docker exec mysql-db mysqladmin ping -h localhost -u root -proot >/dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
fi

# Check Kafka
echo -n "Checking Kafka... "
if docker exec kafka kafka-topics --bootstrap-server localhost:9092 --list >/dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
fi

echo ""
echo "🔍 Checking Microservices:"
echo "-------------------------"

# Check Config Server
check_service "Config Server" "http://localhost:8888/actuator/health"

# Check Discovery Service  
check_service "Discovery Service" "http://localhost:8761/actuator/health"

# Check Auth Service
check_service "Auth Service" "http://localhost:8000/actuator/health"

# Check User Service
check_service "User Service" "http://localhost:8001/actuator/health"

echo ""
echo "🔍 Checking Service Registration:"
echo "--------------------------------"

# Check if services are registered in Eureka
echo -n "Checking Eureka registrations... "
eureka_response=$(curl -s "http://localhost:8761/eureka/apps" 2>/dev/null)

if echo "$eureka_response" | grep -q "AUTH-SERVICE" && echo "$eureka_response" | grep -q "USER-SERVICE"; then
    echo -e "${GREEN}✅ Services registered${NC}"
else
    echo -e "${YELLOW}⚠️  Some services not registered yet${NC}"
fi

echo ""
echo "🧪 Running Basic API Tests:"
echo "----------------------------"

# Test Auth Service Login endpoint
echo -n "Testing Auth Service login endpoint... "
login_response=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@university.edu","password":"password"}' \
    "http://localhost:8000/api/v1/auth/login" 2>/dev/null)

if [ "$login_response" = "200" ] || [ "$login_response" = "401" ]; then
    echo -e "${GREEN}✅ Endpoint accessible${NC} (HTTP $login_response)"
else
    echo -e "${RED}❌ Endpoint not accessible${NC} (HTTP $login_response)"
fi

# Test User Service endpoint
echo -n "Testing User Service users endpoint... "
users_response=$(curl -s -o /dev/null -w "%{http_code}" \
    "http://localhost:8001/api/v1/user/users" 2>/dev/null)

if [ "$users_response" = "200" ] || [ "$users_response" = "401" ] || [ "$users_response" = "403" ]; then
    echo -e "${GREEN}✅ Endpoint accessible${NC} (HTTP $users_response)"
else
    echo -e "${RED}❌ Endpoint not accessible${NC} (HTTP $users_response)"
fi

echo ""
echo "📊 Container Status:"
echo "-------------------"
docker-compose ps

echo ""
echo "🎉 Health check complete!"
echo ""
echo "📋 Quick Access URLs:"
echo "  • Config Server: http://localhost:8888"
echo "  • Discovery Service: http://localhost:8761"  
echo "  • Auth Service: http://localhost:8000"
echo "  • User Service: http://localhost:8001"
echo ""
echo "💡 To view logs: docker-compose logs -f [service-name]"
echo "🔧 To restart: docker-compose restart [service-name]" 