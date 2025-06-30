FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy Maven wrapper and config (only once)
COPY services/academic/mvnw .
COPY services/academic/.mvn .mvn
RUN chmod +x mvnw

# Copy all service POMs into the image (renamed for independence)
COPY services/academic/pom.xml service-1-pom.xml
COPY services/assessment/pom.xml service-2-pom.xml
COPY services/auth/pom.xml service-3-pom.xml
COPY services/config-server/pom.xml service-4-pom.xml
COPY services/discovery/pom.xml service-5-pom.xml
COPY services/enrollment/pom.xml service-6-pom.xml
COPY services/facility/pom.xml service-7-pom.xml
COPY services/gateway/pom.xml service-8-pom.xml
COPY services/user/pom.xml service-9-pom.xml

# Optional: Create dummy src so compile doesn't fail
RUN mkdir -p src/main/java/org/endipi/dop \
 && echo 'package org.endipi.dop; public class DummyClass {}' > src/main/java/org/endipi/dop/DummyClass.java

# Resolve all dependencies for all services (in one layer)
RUN for f in service-1-pom.xml service-2-pom.xml service-3-pom.xml service-4-pom.xml service-5-pom.xml service-6-pom.xml service-7-pom.xml service-8-pom.xml service-9-pom.xml; do \
    echo "Resolving $f" && \
    ./mvnw dependency:go-offline -B -f "$f" && \
    ./mvnw dependency:resolve -B -f "$f" && \
    ./mvnw dependency:resolve-plugins -B -f "$f" || true && \
    ./mvnw compile -B -f "$f" || true; \
  done

# Clean up dummy src
RUN rm -rf src/