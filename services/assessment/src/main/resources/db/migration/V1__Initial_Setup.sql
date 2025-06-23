-- Assessment Service Database Schema
-- Creates 4 tables: class_duration, schedule, attendance, grade

-- 1. Create Class Duration table
CREATE TABLE IF NOT EXISTS class_duration
(
    id
    BIGINT
    NOT
    NULL
    AUTO_INCREMENT,
    start_time
    DATE,
    end_time
    DATE,
    description
    VARCHAR
(
    255
),
    PRIMARY KEY
(
    id
)
    );

-- 2. Create Schedule table
CREATE TABLE IF NOT EXISTS schedule
(
    id
    BIGINT
    NOT
    NULL
    AUTO_INCREMENT,
    session_type
    VARCHAR
(
    20
),
    session_number INT,
    class_duration_id BIGINT,
    course_offering_id BIGINT,
    classroom_id BIGINT,
    PRIMARY KEY
(
    id
),
    UNIQUE KEY UK_schedule
(
    course_offering_id,
    classroom_id
),
    CONSTRAINT FK_schedule_class_duration FOREIGN KEY
(
    class_duration_id
) REFERENCES class_duration
(
    id
)
    );

-- 3. Create Attendance table
CREATE TABLE IF NOT EXISTS attendance
(
    id
    BIGINT
    NOT
    NULL
    AUTO_INCREMENT,
    attendance_status
    VARCHAR
(
    20
),
    student_id BIGINT,
    schedule_id BIGINT NOT NULL,
    PRIMARY KEY
(
    id
),
    UNIQUE KEY UK_attendance
(
    student_id,
    schedule_id
),
    CONSTRAINT FK_attendance_schedule FOREIGN KEY
(
    schedule_id
) REFERENCES schedule
(
    id
)
    );

-- 4. Create Grade table
CREATE TABLE IF NOT EXISTS grade
(
    id
    BIGINT
    NOT
    NULL
    AUTO_INCREMENT,
    score_type
    VARCHAR
(
    20
),
    score_value DOUBLE,
    course_registration_id BIGINT,
    PRIMARY KEY
(
    id
),
    UNIQUE KEY UK_grade
(
    course_registration_id,
    score_type
)
    );

-- Insert Class Duration data (15 records)
INSERT INTO class_duration (start_time, end_time, description)
VALUES ('2024-01-15', '2024-05-15', 'Spring 2024 Semester'),
       ('2024-06-01', '2024-08-31', 'Summer 2024 Semester'),
       ('2024-09-01', '2024-12-31', 'Fall 2024 Semester'),
       ('2025-01-15', '2025-05-15', 'Spring 2025 Semester'),
       ('2025-06-01', '2025-08-31', 'Summer 2025 Semester'),
       ('2025-09-01', '2025-12-31', 'Fall 2025 Semester'),
       ('2026-01-15', '2026-05-15', 'Spring 2026 Semester'),
       ('2024-01-15', '2024-02-29', 'CS101 Theory Block'),
       ('2024-03-01', '2024-04-15', 'CS101 Lab Block'),
       ('2024-01-15', '2024-03-30', 'MATH101 Block 1'),
       ('2024-04-01', '2024-05-15', 'MATH101 Block 2'),
       ('2024-02-01', '2024-04-30', 'PHYS101 Theory and Lab'),
       ('2024-03-15', '2024-05-15', 'Project Development Period'),
       ('2024-04-01', '2024-05-15', 'Final Exam Period'),
       ('2024-01-15', '2024-05-15', 'Full Semester Duration') ON DUPLICATE KEY
UPDATE
    description =
VALUES (description);

-- Insert Schedule data (15 records)
-- Using course_offering_id from enrollment-service (1-20) and classroom_id from facility-service (1-48)
INSERT INTO schedule (session_type, session_number, class_duration_id, course_offering_id, classroom_id)
VALUES
-- Spring 2024 schedules
('LECTURE', 1, 1, 1, 1),  -- CS101 Session 1 in A101
('LECTURE', 2, 1, 1, 1),  -- CS101 Session 2 in A101
('LAB', 1, 1, 1, 32),     -- CS101 Lab Session 1 in E101
('LECTURE', 1, 1, 2, 2),  -- MATH101 Session 1 in A102
('LECTURE', 2, 1, 2, 2),  -- MATH101 Session 2 in A102
('LECTURE', 1, 1, 3, 3),  -- PHYS101 Session 1 in A103
('LAB', 1, 1, 3, 10),     -- PHYS101 Lab Session 1 in B101
('LAB', 1, 1, 4, 11),     -- CHEM101 Lab Session 1 in B102
('LAB', 2, 1, 4, 11),     -- CHEM101 Lab Session 2 in B102
('LECTURE', 1, 1, 6, 26), -- BUS101 Session 1 in D101
('LECTURE', 1, 1, 7, 29), -- ECON101 Session 1 in D201
('LECTURE', 1, 1, 8, 7),  -- ENG101 Session 1 in A301
('LAB', 1, 1, 9, 33),     -- CS201 Lab Session 1 in E102
('LECTURE', 1, 1, 10, 4), -- MATH201 Session 1 in A201
('LECTURE', 2, 1, 10, 4)  -- MATH201 Session 2 in A201
    ON DUPLICATE KEY
UPDATE
    session_type =
VALUES (session_type), session_number =
VALUES (session_number);

-- Insert Attendance data (15 records)
-- Using student_id from user-service (3, 14-32) and schedule_id from above
INSERT INTO attendance (attendance_status, student_id, schedule_id)
VALUES
-- Attendance for CS101 Session 1
('PRESENT', 3, 1),   -- Student 1 present for CS101 Session 1
('PRESENT', 14, 1),  -- Student 2 present for CS101 Session 1
('ABSENT', 25, 1),   -- Student 13 absent for CS101 Session 1

-- Attendance for CS101 Session 2
('PRESENT', 3, 2),   -- Student 1 present for CS101 Session 2
('ABSENT', 14, 2),   -- Student 2 absent for CS101 Session 2

-- Attendance for CS101 Lab Session 1
('PRESENT', 3, 3),   -- Student 1 present for CS101 Lab
('PRESENT', 14, 3),  -- Student 2 present for CS101 Lab

-- Attendance for MATH101 Session 1
('PRESENT', 15, 4),  -- Student 3 present for MATH101 Session 1
('PRESENT', 16, 4),  -- Student 4 present for MATH101 Session 1
('ABSENT', 26, 4),   -- Student 14 absent for MATH101 Session 1

-- Attendance for PHYS101 Session 1
('PRESENT', 17, 6),  -- Student 5 present for PHYS101 Session 1

-- Attendance for CHEM101 Lab
('PRESENT', 18, 8),  -- Student 6 present for CHEM101 Lab
('PRESENT', 18, 9),  -- Student 6 present for CHEM101 Lab Session 2

-- Attendance for BUS101
('PRESENT', 20, 10), -- Student 8 present for BUS101

-- Attendance for ECON101
('PRESENT', 21, 11)  -- Student 9 present for ECON101
    ON DUPLICATE KEY
UPDATE
    attendance_status =
VALUES (attendance_status);

-- Insert Grade data (15 records)
-- Using course_registration_id from enrollment-service (1-20)
INSERT INTO grade (score_type, score_value, course_registration_id)
VALUES
-- Grades for Student registrations
('MID_TERM', 8.5, 1), -- Student 1 CS101 Mid-term: 8.5
('FINAL', 9.0, 1),    -- Student 1 CS101 Final: 9.0
('LAB', 8.8, 1),      -- Student 1 CS101 Lab: 8.8

('MID_TERM', 7.5, 2), -- Student 2 CS101 Mid-term: 7.5
('FINAL', 8.2, 2),    -- Student 2 CS101 Final: 8.2

('MID_TERM', 9.2, 3), -- Student 3 MATH101 Mid-term: 9.2
('FINAL', 8.8, 3),    -- Student 3 MATH101 Final: 8.8

('MID_TERM', 8.0, 4), -- Student 4 MATH101 Mid-term: 8.0
('FINAL', 8.5, 4),    -- Student 4 MATH101 Final: 8.5

('LAB', 9.0, 5),      -- Student 5 PHYS101 Lab: 9.0
('FINAL', 8.7, 5),    -- Student 5 PHYS101 Final: 8.7

('LAB', 8.3, 6),      -- Student 6 CHEM101 Lab: 8.3
('PROJECT', 9.1, 7),  -- Student 7 BIO101 Project: 9.1

('MID_TERM', 7.8, 8), -- Student 8 BUS101 Mid-term: 7.8
('EXAM', 8.9, 11)     -- Student 11 CS201 Exam: 8.9
    ON DUPLICATE KEY
UPDATE
    score_value =
VALUES (score_value);