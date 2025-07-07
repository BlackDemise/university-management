-- User Service Database Schema
-- Creates user, role, student, teacher tables with data matching auth-service

-- Create Role table
CREATE TABLE IF NOT EXISTS role
(
    id
        BIGINT
                    NOT
                        NULL
        AUTO_INCREMENT,
    role_title
        VARCHAR(50) NOT NULL,
    PRIMARY KEY
        (
         id
            ),
    UNIQUE KEY UK_role_title
        (
         role_title
            )
);

-- Create User table
CREATE TABLE IF NOT EXISTS user
(
    id
                      BIGINT
                                   NOT
                                       NULL
        AUTO_INCREMENT, -- Same ID as auth-service
    full_name
                      VARCHAR(255),
    phone             VARCHAR(20),
    identity_number   VARCHAR(20),
    permanent_address VARCHAR(500),
    current_address   VARCHAR(500),
    email             VARCHAR(255) NOT NULL,
    password          VARCHAR(255) NOT NULL,
    avatar_url        VARCHAR(255),
    role_id           BIGINT,
    PRIMARY KEY
        (
         id
            ),
    UNIQUE KEY UK_email
        (
         email
            ),
    CONSTRAINT FK_user_role FOREIGN KEY
        (
         role_id
            ) REFERENCES role
            (
             id
                )
);

-- Create Student table
CREATE TABLE IF NOT EXISTS student
(
    id
                   BIGINT
                               NOT
                                   NULL
        AUTO_INCREMENT,
    student_code
                   VARCHAR(20) NOT NULL,
    birth_date     DATE,
    course_year    INT,
    major_id       BIGINT,
    student_status VARCHAR(20),
    user_id        BIGINT      NOT NULL,
    PRIMARY KEY
        (
         id
            ),
    UNIQUE KEY UK_student_code
        (
         student_code
            ),
    UNIQUE KEY UK_student_user_id
        (
         user_id
            ),
    CONSTRAINT FK_student_user FOREIGN KEY
        (
         user_id
            ) REFERENCES user
            (
             id
                )
);

-- Create Teacher table
CREATE TABLE IF NOT EXISTS teacher
(
    id
                  BIGINT
                              NOT
                                  NULL
        AUTO_INCREMENT,
    teacher_code
                  VARCHAR(20) NOT NULL,
    academic_rank VARCHAR(100),
    degree        VARCHAR(100),
    user_id       BIGINT      NOT NULL,
    PRIMARY KEY
        (
         id
            ),
    UNIQUE KEY UK_teacher_code
        (
         teacher_code
            ),
    UNIQUE KEY UK_teacher_user_id
        (
         user_id
            ),
    CONSTRAINT FK_teacher_user FOREIGN KEY
        (
         user_id
            ) REFERENCES user
            (
             id
                )
);

-- Insert Role data (matching auth-service roles)
INSERT INTO role (id, role_title)
VALUES (1, 'ADMIN'),
       (2, 'TEACHER'),
       (3, 'STUDENT'),
       (4, 'ADMINISTRATOR_STAFF'),
       (5, 'DORMITORY_STAFF'),
       (6, 'LIBRARIAN'),
       (7, 'ALUMNI'),
       (8, 'APPLICANT'),
       (9, 'IT_STAFF'),
       (10, 'FINANCE_STAFF'),
       (11, 'SECURITY_STAFF'),
       (12, 'RESEARCH_MANAGER')
ON DUPLICATE KEY
    UPDATE role_title =
               VALUES(role_title);

-- Insert ALL User data (matching auth-service IDs and emails)
INSERT INTO user (id, email, password, role_id, full_name)
VALUES
-- ADMIN users (2 users)
(1, 'admin@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 1, 'Admin User'),
(13, 'admin2@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 1, 'Admin User 2'),

-- TEACHER users (10 users)
(2, 'teacher@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 2, 'Teacher User'),
(73, 'teacher2@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 2, 'Teacher User 2'),
(74, 'teacher3@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 2, 'Teacher User 3'),
(75, 'teacher4@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 2, 'Teacher User 4'),
(76, 'teacher5@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 2, 'Teacher User 5'),
(77, 'teacher6@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 2, 'Teacher User 6'),
(78, 'teacher7@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 2, 'Teacher User 7'),
(79, 'teacher8@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 2, 'Teacher User 8'),
(80, 'teacher9@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 2, 'Teacher User 9'),
(81, 'teacher10@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 2, 'Teacher User 10'),

-- STUDENT users (60 users)
(3, 'student@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User'),
(14, 'student2@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 2'),
(15, 'student3@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 3'),
(16, 'student4@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 4'),
(17, 'student5@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 5'),
(18, 'student6@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 6'),
(19, 'student7@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 7'),
(20, 'student8@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 8'),
(21, 'student9@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 9'),
(22, 'student10@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 10'),
(23, 'student11@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 11'),
(24, 'student12@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 12'),
(25, 'student13@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 13'),
(26, 'student14@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 14'),
(27, 'student15@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 15'),
(28, 'student16@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 16'),
(29, 'student17@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 17'),
(30, 'student18@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 18'),
(31, 'student19@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 19'),
(32, 'student20@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 20'),
(33, 'student21@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 21'),
(34, 'student22@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 22'),
(35, 'student23@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 23'),
(36, 'student24@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 24'),
(37, 'student25@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 25'),
(38, 'student26@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 26'),
(39, 'student27@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 27'),
(40, 'student28@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 28'),
(41, 'student29@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 29'),
(42, 'student30@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 30'),
(43, 'student31@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 31'),
(44, 'student32@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 32'),
(45, 'student33@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 33'),
(46, 'student34@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 34'),
(47, 'student35@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 35'),
(48, 'student36@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 36'),
(49, 'student37@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 37'),
(50, 'student38@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 38'),
(51, 'student39@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 39'),
(52, 'student40@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 40'),
(53, 'student41@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 41'),
(54, 'student42@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 42'),
(55, 'student43@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 43'),
(56, 'student44@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 44'),
(57, 'student45@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 45'),
(58, 'student46@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 46'),
(59, 'student47@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 47'),
(60, 'student48@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 48'),
(61, 'student49@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 49'),
(62, 'student50@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 50'),
(63, 'student51@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 51'),
(64, 'student52@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 52'),
(65, 'student53@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 53'),
(66, 'student54@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 54'),
(67, 'student55@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 55'),
(68, 'student56@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 56'),
(69, 'student57@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 57'),
(70, 'student58@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 58'),
(71, 'student59@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 59'),
(72, 'student60@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 3, 'Student User 60'),

-- ADMINISTRATOR_STAFF users (10 users)
(4, 'admin-staff@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 4,
 'Administrative Staff'),
(82, 'admin-staff2@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 4,
 'Administrative Staff 2'),
(83, 'admin-staff3@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 4,
 'Administrative Staff 3'),
(84, 'admin-staff4@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 4,
 'Administrative Staff 4'),
(85, 'admin-staff5@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 4,
 'Administrative Staff 5'),
(86, 'admin-staff6@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 4,
 'Administrative Staff 6'),
(87, 'admin-staff7@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 4,
 'Administrative Staff 7'),
(88, 'admin-staff8@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 4,
 'Administrative Staff 8'),
(89, 'admin-staff9@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 4,
 'Administrative Staff 9'),
(90, 'admin-staff10@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 4,
 'Administrative Staff 10'),

-- DORMITORY_STAFF users (10 users)
(5, 'dormitory@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 5, 'Dormitory Staff'),
(91, 'dormitory2@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 5,
 'Dormitory Staff 2'),
(92, 'dormitory3@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 5,
 'Dormitory Staff 3'),
(93, 'dormitory4@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 5,
 'Dormitory Staff 4'),
(94, 'dormitory5@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 5,
 'Dormitory Staff 5'),
(95, 'dormitory6@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 5,
 'Dormitory Staff 6'),
(96, 'dormitory7@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 5,
 'Dormitory Staff 7'),
(97, 'dormitory8@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 5,
 'Dormitory Staff 8'),
(98, 'dormitory9@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 5,
 'Dormitory Staff 9'),
(99, 'dormitory10@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 5,
 'Dormitory Staff 10'),

-- LIBRARIAN users (10 users)
(6, 'librarian@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 6, 'Librarian User'),
(100, 'librarian2@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 6,
 'Librarian User 2'),
(101, 'librarian3@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 6,
 'Librarian User 3'),
(102, 'librarian4@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 6,
 'Librarian User 4'),
(103, 'librarian5@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 6,
 'Librarian User 5'),
(104, 'librarian6@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 6,
 'Librarian User 6'),
(105, 'librarian7@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 6,
 'Librarian User 7'),
(106, 'librarian8@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 6,
 'Librarian User 8'),
(107, 'librarian9@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 6,
 'Librarian User 9'),
(108, 'librarian10@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 6,
 'Librarian User 10'),

-- ALUMNI users (10 users)
(7, 'alumni@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 7, 'Alumni User'),
(109, 'alumni2@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 7, 'Alumni User 2'),
(110, 'alumni3@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 7, 'Alumni User 3'),
(111, 'alumni4@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 7, 'Alumni User 4'),
(112, 'alumni5@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 7, 'Alumni User 5'),
(113, 'alumni6@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 7, 'Alumni User 6'),
(114, 'alumni7@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 7, 'Alumni User 7'),
(115, 'alumni8@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 7, 'Alumni User 8'),
(116, 'alumni9@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 7, 'Alumni User 9'),
(117, 'alumni10@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 7, 'Alumni User 10'),

-- APPLICANT users (10 users)
(8, 'applicant@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 8, 'Applicant User'),
(118, 'applicant2@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 8,
 'Applicant User 2'),
(119, 'applicant3@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 8,
 'Applicant User 3'),
(120, 'applicant4@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 8,
 'Applicant User 4'),
(121, 'applicant5@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 8,
 'Applicant User 5'),
(122, 'applicant6@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 8,
 'Applicant User 6'),
(123, 'applicant7@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 8,
 'Applicant User 7'),
(124, 'applicant8@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 8,
 'Applicant User 8'),
(125, 'applicant9@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 8,
 'Applicant User 9'),
(126, 'applicant10@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 8,
 'Applicant User 10'),

-- IT_STAFF users (10 users)
(9, 'it@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 9, 'IT Staff'),
(127, 'it2@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 9, 'IT Staff 2'),
(128, 'it3@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 9, 'IT Staff 3'),
(129, 'it4@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 9, 'IT Staff 4'),
(130, 'it5@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 9, 'IT Staff 5'),
(131, 'it6@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 9, 'IT Staff 6'),
(132, 'it7@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 9, 'IT Staff 7'),
(133, 'it8@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 9, 'IT Staff 8'),
(134, 'it9@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 9, 'IT Staff 9'),
(135, 'it10@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 9, 'IT Staff 10'),

-- FINANCE_STAFF users (10 users)
(10, 'finance@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 10, 'Finance Staff'),
(136, 'finance2@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 10, 'Finance Staff 2'),
(137, 'finance3@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 10, 'Finance Staff 3'),
(138, 'finance4@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 10, 'Finance Staff 4'),
(139, 'finance5@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 10, 'Finance Staff 5'),
(140, 'finance6@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 10, 'Finance Staff 6'),
(141, 'finance7@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 10, 'Finance Staff 7'),
(142, 'finance8@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 10, 'Finance Staff 8'),
(143, 'finance9@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 10, 'Finance Staff 9'),
(144, 'finance10@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 10,
 'Finance Staff 10'),

-- SECURITY_STAFF users (10 users)
(11, 'security@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 11, 'Security Staff'),
(145, 'security2@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 11,
 'Security Staff 2'),
(146, 'security3@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 11,
 'Security Staff 3'),
(147, 'security4@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 11,
 'Security Staff 4'),
(148, 'security5@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 11,
 'Security Staff 5'),
(149, 'security6@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 11,
 'Security Staff 6'),
(150, 'security7@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 11,
 'Security Staff 7'),
(151, 'security8@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 11,
 'Security Staff 8'),
(152, 'security9@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 11,
 'Security Staff 9'),
(153, 'security10@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 11,
 'Security Staff 10'),

-- RESEARCH_MANAGER users (10 users)
(12, 'research@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 12, 'Research Manager'),
(154, 'research2@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 12,
 'Research Manager 2'),
(155, 'research3@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 12,
 'Research Manager 3'),
(156, 'research4@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 12,
 'Research Manager 4'),
(157, 'research5@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 12,
 'Research Manager 5'),
(158, 'research6@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 12,
 'Research Manager 6'),
(159, 'research7@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 12,
 'Research Manager 7'),
(160, 'research8@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 12,
 'Research Manager 8'),
(161, 'research9@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 12,
 'Research Manager 9'),
(162, 'research10@university.edu', '$2a$12$0APqcb0XWdY8Hy9kiE2QuOuzsHwc6lhAuQpvJwKEzAAUiWf0UOeMK', 12,
 'Research Manager 10')
ON DUPLICATE KEY
    UPDATE email     =
               VALUES(email),
           full_name =
               VALUES(full_name),
           role_id   =
               VALUES(role_id);

-- Insert ALL Teacher data (for users with TEACHER role - 10 teachers)
INSERT INTO teacher (teacher_code, user_id, academic_rank, degree)
VALUES ('T001', 2, 'Associate Professor', 'PhD Computer Science'),
       ('T002', 73, 'Lecturer', 'Master Engineering'),
       ('T003', 74, 'Professor', 'PhD Mathematics'),
       ('T004', 75, 'Lecturer', 'Master Business Administration'),
       ('T005', 76, 'Associate Professor', 'PhD Physics'),
       ('T006', 77, 'Lecturer', 'Master Chemistry'),
       ('T007', 78, 'Professor', 'PhD Literature'),
       ('T008', 79, 'Lecturer', 'Master History'),
       ('T009', 80, 'Associate Professor', 'PhD Biology'),
       ('T010', 81, 'Lecturer', 'Master Psychology')
ON DUPLICATE KEY
    UPDATE teacher_code  =
               VALUES(teacher_code),
           academic_rank =
               VALUES(academic_rank),
           degree        =
               VALUES(degree);

-- Insert ALL Student data (for users with STUDENT role - 60 students)
INSERT INTO student (student_code, user_id, birth_date, course_year, student_status)
VALUES
-- Year 2022 students (20 students)
('S001', 3, '2002-01-15', 2022, 'ACTIVE'),
('S002', 14, '2002-03-20', 2022, 'ACTIVE'),
('S003', 15, '2002-05-10', 2022, 'ACTIVE'),
('S004', 16, '2002-07-25', 2022, 'ACTIVE'),
('S005', 17, '2002-09-12', 2022, 'ACTIVE'),
('S006', 18, '2002-11-08', 2022, 'ACTIVE'),
('S007', 19, '2002-12-30', 2022, 'ACTIVE'),
('S008', 20, '2002-02-14', 2022, 'ACTIVE'),
('S009', 21, '2002-04-18', 2022, 'ACTIVE'),
('S010', 22, '2002-06-22', 2022, 'ACTIVE'),
('S011', 23, '2002-08-05', 2022, 'ACTIVE'),
('S012', 24, '2002-10-17', 2022, 'ACTIVE'),
('S013', 25, '2002-12-03', 2022, 'ACTIVE'),
('S014', 26, '2002-01-28', 2022, 'ACTIVE'),
('S015', 27, '2002-03-11', 2022, 'ACTIVE'),
('S016', 28, '2002-05-07', 2022, 'ACTIVE'),
('S017', 29, '2002-07-19', 2022, 'ACTIVE'),
('S018', 30, '2002-09-23', 2022, 'ACTIVE'),
('S019', 31, '2002-11-15', 2022, 'ACTIVE'),
('S020', 32, '2002-01-09', 2022, 'ACTIVE'),

-- Year 2023 students (20 students)
('S021', 33, '2003-02-14', 2023, 'ACTIVE'),
('S022', 34, '2003-04-18', 2023, 'ACTIVE'),
('S023', 35, '2003-06-22', 2023, 'ACTIVE'),
('S024', 36, '2003-08-26', 2023, 'ACTIVE'),
('S025', 37, '2003-10-30', 2023, 'ACTIVE'),
('S026', 38, '2003-12-04', 2023, 'ACTIVE'),
('S027', 39, '2003-01-08', 2023, 'ACTIVE'),
('S028', 40, '2003-03-14', 2023, 'ACTIVE'),
('S029', 41, '2003-05-18', 2023, 'ACTIVE'),
('S030', 42, '2003-07-22', 2023, 'ACTIVE'),
('S031', 43, '2003-09-26', 2023, 'ACTIVE'),
('S032', 44, '2003-11-30', 2023, 'ACTIVE'),
('S033', 45, '2003-02-03', 2023, 'ACTIVE'),
('S034', 46, '2003-04-07', 2023, 'ACTIVE'),
('S035', 47, '2003-06-11', 2023, 'ACTIVE'),
('S036', 48, '2003-08-15', 2023, 'ACTIVE'),
('S037', 49, '2003-10-19', 2023, 'ACTIVE'),
('S038', 50, '2003-12-23', 2023, 'ACTIVE'),
('S039', 51, '2003-01-27', 2023, 'ACTIVE'),
('S040', 52, '2003-03-31', 2023, 'ACTIVE'),

-- Year 2024 students (20 students) - some suspended/graduated for variety
('S041', 53, '2004-05-04', 2024, 'ACTIVE'),
('S042', 54, '2004-07-08', 2024, 'ACTIVE'),
('S043', 55, '2004-09-12', 2024, 'ACTIVE'),
('S044', 56, '2004-11-16', 2024, 'SUSPENDED'),
('S045', 57, '2004-01-20', 2024, 'ACTIVE'),
('S046', 58, '2004-03-24', 2024, 'ACTIVE'),
('S047', 59, '2004-05-28', 2024, 'ACTIVE'),
('S048', 60, '2004-07-01', 2024, 'ACTIVE'),
('S049', 61, '2004-09-05', 2024, 'SUSPENDED'),
('S050', 62, '2004-11-09', 2024, 'ACTIVE'),
('S051', 63, '2004-01-13', 2024, 'ACTIVE'),
('S052', 64, '2004-03-17', 2024, 'ACTIVE'),
('S053', 65, '2004-05-21', 2024, 'ACTIVE'),
('S054', 66, '2004-07-25', 2024, 'ACTIVE'),
('S055', 67, '2004-09-29', 2024, 'ACTIVE'),
('S056', 68, '2004-12-02', 2024, 'ACTIVE'),
('S057', 69, '2004-02-06', 2024, 'ACTIVE'),
('S058', 70, '2004-04-10', 2024, 'ACTIVE'),
('S059', 71, '2004-06-14', 2024, 'ACTIVE'),
('S060', 72, '2004-08-18', 2024, 'ACTIVE')
ON DUPLICATE KEY
    UPDATE student_code   =
               VALUES(student_code),
           birth_date     =
               VALUES(birth_date),
           course_year    =
               VALUES(course_year),
           student_status =
               VALUES(student_status);