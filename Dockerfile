# Build stage
FROM gradle:8.7.0-jdk21 AS build
# Reason: gradle:9 image sometimes fails to resolve base JDK images on Docker Hub

WORKDIR /app

COPY settings.gradle.kts build.gradle.kts ./
COPY gradle ./gradle
COPY src ./src

RUN gradle clean build --no-daemon -x test

# Runtime stage
FROM eclipse-temurin:21-jdk-noble AS runtime
# Alternatives if you want Debian instead:
# FROM eclipse-temurin:21-jdk-bookworm
# FROM eclipse-temurin:21-jdk-jammy

RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --gid 1001 appuser

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar
RUN chown appuser:appgroup app.jar

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]

# # Build stage
# FROM gradle:9.0.0-jdk21 AS build

# WORKDIR /app

# COPY build.gradle.kts settings.gradle.kts ./
# COPY gradle ./gradle
# COPY src ./src

# # RUN gradle build --no-daemon --stacktrace -x test
# RUN gradle build --no-daemon --stacktrace -x test --refresh-dependencies
# # Runtime stage
# FROM openjdk:21-jdk-slim-bullseye AS runtime

# RUN addgroup --system --gid 1001 appgroup && \
#     adduser --system --uid 1001 --gid 1001 appuser

# WORKDIR /app

# COPY --from=build /app/build/libs/*.jar app.jar


# RUN chown appuser:appgroup app.jar

# USER appuser

# EXPOSE 8080

# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#     CMD curl -f http://localhost:8080/actuator/health || exit 1

# ENTRYPOINT ["java", "-jar", "app.jar"]