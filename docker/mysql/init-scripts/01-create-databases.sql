-- Create databases for microservices
-- This script runs automatically when MySQL container starts for the first time

-- Auth Service Database
CREATE DATABASE IF NOT EXISTS auth_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- User Service Database  
CREATE DATABASE IF NOT EXISTS user_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Academic Service Database (for future use)
CREATE DATABASE IF NOT EXISTS academic_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Facility Service Database (for future use)
CREATE DATABASE IF NOT EXISTS facility_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Enrollment Service Database (for future use)
CREATE DATABASE IF NOT EXISTS enrollment_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Assessment Service Database (for future use)
CREATE DATABASE IF NOT EXISTS assessment_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Show created databases
SHOW DATABASES;

-- Create application user (optional - for better security)
-- CREATE USER IF NOT EXISTS 'university_app'@'%' IDENTIFIED BY 'university_password';
-- GRANT ALL PRIVILEGES ON auth_service.* TO 'university_app'@'%';
-- GRANT ALL PRIVILEGES ON user_service.* TO 'university_app'@'%';
-- GRANT ALL PRIVILEGES ON academic_service.* TO 'university_app'@'%';
-- GRANT ALL PRIVILEGES ON facility_service.* TO 'university_app'@'%';
-- GRANT ALL PRIVILEGES ON enrollment_service.* TO 'university_app'@'%';
-- GRANT ALL PRIVILEGES ON assessment_service.* TO 'university_app'@'%';
-- FLUSH PRIVILEGES; 