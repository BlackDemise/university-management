-- Assessment Service Database Schema
-- Creates 3 tables: session, attendance, grade

-- 1. Create Session table
CREATE TABLE IF NOT EXISTS session
(
    id                 BIGINT NOT NULL AUTO_INCREMENT,
    session_type       VARCHAR(20),
    session_number     INT,
    start_time         DATETIME,
    end_time           DATETIME,
    course_offering_id BIGINT,
    classroom_id       BIGINT,
    PRIMARY KEY (id),
    UNIQUE KEY UK_classroom_time (classroom_id, start_time, end_time)
);

-- 2. Create Attendance table
CREATE TABLE IF NOT EXISTS attendance
(
    id                BIGINT NOT NULL AUTO_INCREMENT,
    attendance_status VARCHAR(20),
    student_id        BIGINT,
    session_id        BIGINT,
    PRIMARY KEY (id),
    UNIQUE KEY UK_student_session (student_id, session_id),
    FOREIGN KEY (session_id) REFERENCES session (id)
);

-- 3. Create Grade table
CREATE TABLE IF NOT EXISTS grade
(
    id                     BIGINT NOT NULL AUTO_INCREMENT,
    grade_type             VARCHAR(20),
    grade_value            DOUBLE,
    course_registration_id BIGINT,
    PRIMARY KEY (id),
    UNIQUE KEY UK_registration_score_type (course_registration_id, grade_type)
);

-- Insert Sample Session data (20 sessions)
INSERT INTO session (session_type, session_number, start_time, end_time, course_offering_id, classroom_id)
VALUES ('LECTURE', 1, '2024-10-15 07:30:00', '2024-10-15 09:30:00', 1, 1),
       ('LECTURE', 2, '2024-10-17 07:30:00', '2024-10-17 09:30:00', 1, 1),
       ('LAB', 3, '2024-10-19 14:00:00', '2024-10-19 16:00:00', 1, 5),
       ('LECTURE', 4, '2024-10-22 07:30:00', '2024-10-22 09:30:00', 1, 1),
       ('LAB', 5, '2024-10-24 14:00:00', '2024-10-24 16:00:00', 1, 5),
       ('LECTURE', 6, '2024-10-29 07:30:00', '2024-10-29 09:30:00', 1, 1),
       ('LECTURE', 7, '2024-10-31 07:30:00', '2024-10-31 09:30:00', 1, 1),
       ('LAB', 8, '2024-11-02 14:00:00', '2024-11-02 16:00:00', 1, 5),
       ('LECTURE', 9, '2024-11-05 07:30:00', '2024-11-05 09:30:00', 1, 1),
       ('LAB', 10, '2024-11-07 14:00:00', '2024-11-07 16:00:00', 1, 5),
       ('LECTURE', 11, '2024-11-12 07:30:00', '2024-11-12 09:30:00', 1, 1),
       ('LECTURE', 12, '2024-11-14 07:30:00', '2024-11-14 09:30:00', 1, 1),
       ('LAB', 13, '2024-11-16 14:00:00', '2024-11-16 16:00:00', 1, 5),
       ('LECTURE', 14, '2024-11-19 07:30:00', '2024-11-19 09:30:00', 1, 1),
       ('LAB', 15, '2024-11-21 14:00:00', '2024-11-21 16:00:00', 1, 5),

-- Course Offering 2 sessions (Web Development)
       ('LECTURE', 1, '2024-10-16 10:00:00', '2024-10-16 12:00:00', 2, 2),
       ('LAB', 2, '2024-10-18 15:00:00', '2024-10-18 17:00:00', 2, 6),
       ('LECTURE', 3, '2024-10-23 10:00:00', '2024-10-23 12:00:00', 2, 2),
       ('LAB', 4, '2024-10-25 15:00:00', '2024-10-25 17:00:00', 2, 6),
       ('LECTURE', 5, '2024-10-30 10:00:00', '2024-10-30 12:00:00', 2, 2)
ON DUPLICATE KEY UPDATE session_type = VALUES(session_type);

-- Insert Sample Attendance data (20 attendance records)
INSERT INTO attendance (attendance_status, student_id, session_id)
VALUES ('PRESENT', 1, 1),
       ('PRESENT', 2, 1),
       ('ABSENT', 3, 1),
       ('PRESENT', 4, 1),
       ('LATE', 5, 1),
       ('PRESENT', 1, 2),
       ('ABSENT', 2, 2),
       ('PRESENT', 3, 2),
       ('PRESENT', 4, 2),
       ('PRESENT', 5, 2),
       ('PRESENT', 1, 3),
       ('PRESENT', 2, 3),
       ('PRESENT', 3, 3),
       ('LATE', 4, 3),
       ('ABSENT', 5, 3),
       ('PRESENT', 1, 4),
       ('PRESENT', 2, 4),
       ('PRESENT', 3, 4),
       ('PRESENT', 4, 4),
       ('PRESENT', 5, 4)
ON DUPLICATE KEY UPDATE attendance_status = VALUES(attendance_status);

-- Insert Sample Grade data (20 grade records)
INSERT INTO grade (grade_type, grade_value, course_registration_id)
VALUES ('MID_TERM', 85.5, 1),
       ('FINAL', 92.0, 1),
       ('ASSIGNMENT', 88.0, 1),
       ('QUIZ', 90.5, 1),
       ('MID_TERM', 78.0, 2),
       ('FINAL', 85.5, 2),
       ('ASSIGNMENT', 82.0, 2),
       ('QUIZ', 87.0, 2),
       ('MID_TERM', 92.5, 3),
       ('FINAL', 89.0, 3),
       ('ASSIGNMENT', 95.0, 3),
       ('QUIZ', 93.5, 3),
       ('MID_TERM', 76.0, 4),
       ('FINAL', 81.5, 4),
       ('ASSIGNMENT', 79.0, 4),
       ('QUIZ', 84.0, 4),
       ('MID_TERM', 88.5, 5),
       ('FINAL', 91.0, 5),
       ('ASSIGNMENT', 86.5, 5),
       ('QUIZ', 89.0, 5)
ON DUPLICATE KEY UPDATE grade_value = VALUES(grade_value);