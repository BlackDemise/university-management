# Use the shared dependency image as base
FROM shared-deps:latest AS builder
WORKDIR /app

# Copy pom.xml with exact name
# Optimization strategy: copy things that are changed less frequently first...
COPY pom.xml ./pom.xml

# Copy source and build using offline mode (dependencies already in the image)
# ...then copy things that change more frequently later.
COPY src ./src
RUN ./mvnw clean package -DskipTests -B -o

# Runtime stage
# Use a lightweight JRE image for the final application
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]