-- Enrollment Service Database Schema
-- Creates 3 tables: semester, course_offering, course_registration

-- 1. Create Semester table
CREATE TABLE IF NOT EXISTS semester
(
    id
    BIGINT
    NOT
    NULL
    AUTO_INCREMENT,
    name
    VARCHAR
(
    100
) NOT NULL,
    start_date DATE,
    end_date DATE,
    PRIMARY KEY
(
    id
),
    UNIQUE KEY UK_semester_name
(
    name
)
    );

-- 2. Create Course Offering table
CREATE TABLE IF NOT EXISTS course_offering
(
    id
    BIGINT
    NOT
    NULL
    AUTO_INCREMENT,
    max_students
    INT,
    current_students
    INT
    DEFAULT
    0,
    open_time
    DATETIME,
    close_time
    DATETIME,
    course_id
    BIGINT,
    semester_id
    BIGINT
    NOT
    NULL,
    teacher_id
    BIGINT,
    classroom_id
    BIGINT,
    PRIMARY
    KEY
(
    id
),
    UNIQUE KEY UK_course_offering
(
    course_id,
    semester_id,
    teacher_id,
    classroom_id
),
    CONSTRAINT FK_course_offering_semester FOREIGN KEY
(
    semester_id
) REFERENCES semester
(
    id
)
    );

-- 3. Create Course Registration table
CREATE TABLE IF NOT EXISTS course_registration
(
    id
    BIGINT
    NOT
    NULL
    AUTO_INCREMENT,
    registration_date
    DATETIME,
    course_registration_status
    VARCHAR
(
    20
),
    student_id BIGINT,
    course_offering_id BIGINT NOT NULL,
    PRIMARY KEY
(
    id
),
    UNIQUE KEY UK_course_registration
(
    student_id,
    course_offering_id
),
    CONSTRAINT FK_course_registration_offering FOREIGN KEY
(
    course_offering_id
) REFERENCES course_offering
(
    id
)
    );

-- Insert Semester data (20 records - covering 10 years)
INSERT INTO semester (name, start_date, end_date)
VALUES ('Fall 2020', '2020-09-01', '2020-12-31'),
       ('Spring 2021', '2021-01-15', '2021-05-15'),
       ('Summer 2021', '2021-06-01', '2021-08-31'),
       ('Fall 2021', '2021-09-01', '2021-12-31'),
       ('Spring 2022', '2022-01-15', '2022-05-15'),
       ('Summer 2022', '2022-06-01', '2022-08-31'),
       ('Fall 2022', '2022-09-01', '2022-12-31'),
       ('Spring 2023', '2023-01-15', '2023-05-15'),
       ('Summer 2023', '2023-06-01', '2023-08-31'),
       ('Fall 2023', '2023-09-01', '2023-12-31'),
       ('Spring 2024', '2024-01-15', '2024-05-15'),
       ('Summer 2024', '2024-06-01', '2024-08-31'),
       ('Fall 2024', '2024-09-01', '2024-12-31'),
       ('Spring 2025', '2025-01-15', '2025-05-15'),
       ('Summer 2025', '2025-06-01', '2025-08-31'),
       ('Fall 2025', '2025-09-01', '2025-12-31'),
       ('Spring 2026', '2026-01-15', '2026-05-15'),
       ('Summer 2026', '2026-06-01', '2026-08-31'),
       ('Fall 2026', '2026-09-01', '2026-12-31'),
       ('Spring 2027', '2027-01-15', '2027-05-15') ON DUPLICATE KEY
UPDATE
    start_date =
VALUES (start_date), end_date =
VALUES (end_date);

-- Insert Course Offering data (20 records)
-- Using course IDs from academic-service (1-10), teacher IDs from user-service (2, 73-81), classroom IDs from facility-service (1-48)
INSERT INTO course_offering (max_students, current_students, open_time, close_time, course_id, semester_id, teacher_id,
                             classroom_id)
VALUES
-- Spring 2024 offerings
(40, 0, '2024-01-01 08:00:00', '2024-01-20 23:59:59', 1, 11, 2, 1),   -- CS101 by Teacher 1 in A101
(50, 0, '2024-01-01 08:00:00', '2024-01-20 23:59:59', 2, 11, 74, 2),  -- MATH101 by Teacher 3 in A102
(30, 0, '2024-01-01 08:00:00', '2024-01-20 23:59:59', 3, 11, 76, 3),  -- PHYS101 by Teacher 5 in A103
(35, 0, '2024-01-01 08:00:00', '2024-01-20 23:59:59', 4, 11, 77, 10), -- CHEM101 by Teacher 6 in B101 (Lab)
(45, 0, '2024-01-01 08:00:00', '2024-01-20 23:59:59', 5, 11, 78, 11), -- BIO101 by Teacher 7 in B102 (Lab)
(40, 0, '2024-01-01 08:00:00', '2024-01-20 23:59:59', 6, 11, 79, 26), -- BUS101 by Teacher 8 in D101
(45, 0, '2024-01-01 08:00:00', '2024-01-20 23:59:59', 7, 11, 80, 29), -- ECON101 by Teacher 9 in D201
(60, 0, '2024-01-01 08:00:00', '2024-01-20 23:59:59', 8, 11, 81, 7),  -- ENG101 by Teacher 10 in A301
(35, 0, '2024-01-01 08:00:00', '2024-01-20 23:59:59', 9, 11, 73, 32), -- CS201 by Teacher 2 in E101 (Lab)
(40, 0, '2024-01-01 08:00:00', '2024-01-20 23:59:59', 10, 11, 75, 4), -- MATH201 by Teacher 4 in A201

-- Summer 2024 offerings
(25, 0, '2024-05-01 08:00:00', '2024-05-20 23:59:59', 1, 12, 2, 20),  -- CS101 by Teacher 1 in C102 (Lab)
(30, 0, '2024-05-01 08:00:00', '2024-05-20 23:59:59', 2, 12, 74, 5),  -- MATH101 by Teacher 3 in A202
(20, 0, '2024-05-01 08:00:00', '2024-05-20 23:59:59', 8, 12, 81, 37), -- ENG101 by Teacher 10 in F101
(25, 0, '2024-05-01 08:00:00', '2024-05-20 23:59:59', 9, 12, 73, 33), -- CS201 by Teacher 2 in E102 (Lab)
(30, 0, '2024-05-01 08:00:00', '2024-05-20 23:59:59', 6, 12, 79, 27), -- BUS101 by Teacher 8 in D102

-- Fall 2024 offerings
(50, 0, '2024-08-01 08:00:00', '2024-08-20 23:59:59', 1, 13, 2, 35),  -- CS101 by Teacher 1 in E201
(55, 0, '2024-08-01 08:00:00', '2024-08-20 23:59:59', 2, 13, 74, 6),  -- MATH101 by Teacher 3 in A203
(40, 0, '2024-08-01 08:00:00', '2024-08-20 23:59:59', 3, 13, 76, 8),  -- PHYS101 by Teacher 5 in A302
(30, 0, '2024-08-01 08:00:00', '2024-08-20 23:59:59', 4, 13, 77, 12), -- CHEM101 by Teacher 6 in B103 (Lab)
(35, 0, '2024-08-01 08:00:00', '2024-08-20 23:59:59', 5, 13, 78, 13), -- BIO101 by Teacher 7 in B201 (Lab)

-- Spring 2025 offerings
(45, 0, '2025-01-01 08:00:00', '2025-01-20 23:59:59', 9, 14, 73, 34), -- CS201 by Teacher 2 in E103 (Lab)
(40, 0, '2025-01-01 08:00:00', '2025-01-20 23:59:59', 10, 14, 75, 9)  -- MATH201 by Teacher 4 in A303
    ON DUPLICATE KEY
UPDATE
    max_students =
VALUES (max_students), open_time =
VALUES (open_time), close_time =
VALUES (close_time);

-- Insert Course Registration data (20 records)
-- Using student IDs from user-service (3, 14-72)
INSERT INTO course_registration (registration_date, course_registration_status, student_id, course_offering_id)
VALUES
-- Registrations for Spring 2024 offerings
('2024-01-15 09:30:00', 'REGISTERED', 3, 1),   -- Student 1 registers for CS101
('2024-01-15 10:15:00', 'REGISTERED', 14, 1),  -- Student 2 registers for CS101
('2024-01-15 11:00:00', 'REGISTERED', 15, 2),  -- Student 3 registers for MATH101
('2024-01-15 14:30:00', 'REGISTERED', 16, 2),  -- Student 4 registers for MATH101
('2024-01-16 08:45:00', 'REGISTERED', 17, 3),  -- Student 5 registers for PHYS101
('2024-01-16 09:20:00', 'REGISTERED', 18, 4),  -- Student 6 registers for CHEM101
('2024-01-16 10:10:00', 'REGISTERED', 19, 5),  -- Student 7 registers for BIO101
('2024-01-16 13:45:00', 'REGISTERED', 20, 6),  -- Student 8 registers for BUS101
('2024-01-17 08:30:00', 'REGISTERED', 21, 7),  -- Student 9 registers for ECON101
('2024-01-17 09:15:00', 'REGISTERED', 22, 8),  -- Student 10 registers for ENG101
('2024-01-17 11:30:00', 'REGISTERED', 23, 9),  -- Student 11 registers for CS201
('2024-01-18 08:45:00', 'REGISTERED', 24, 10), -- Student 12 registers for MATH201
('2024-01-18 14:20:00', 'CANCELLED', 25, 1),   -- Student 13 cancelled CS101
('2024-01-19 09:30:00', 'PROCESSING', 26, 2),  -- Student 14 processing MATH101

-- Registrations for Summer 2024 offerings
('2024-05-10 10:00:00', 'REGISTERED', 27, 11), -- Student 15 registers for Summer CS101
('2024-05-10 11:30:00', 'REGISTERED', 28, 12), -- Student 16 registers for Summer MATH101
('2024-05-11 09:15:00', 'REGISTERED', 29, 13), -- Student 17 registers for Summer ENG101
('2024-05-11 14:45:00', 'REGISTERED', 30, 14), -- Student 18 registers for Summer CS201

-- Registrations for Fall 2024 offerings
('2024-08-15 08:30:00', 'REGISTERED', 31, 16), -- Student 19 registers for Fall MATH101
('2024-08-15 10:20:00', 'REGISTERED', 32, 17)  -- Student 20 registers for Fall PHYS101
    ON DUPLICATE KEY
UPDATE
    registration_date =
VALUES (registration_date), course_registration_status =
VALUES (course_registration_status);