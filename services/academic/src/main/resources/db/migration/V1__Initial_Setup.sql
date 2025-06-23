-- Academic Service Database Schema
-- Creates 6 tables: department, major, course, program_curriculum, prerequisite_course, department_member

-- 1. Create Department table
CREATE TABLE IF NOT EXISTS department
(
    id
    BIGINT
    NOT
    NULL
    AUTO_INCREMENT,
    name
    VARCHAR
(
    255
) NOT NULL,
    PRIMARY KEY
(
    id
),
    UNIQUE KEY UK_department_name
(
    name
)
    );

-- 2. Create Major table
CREATE TABLE IF NOT EXISTS major
(
    id
    BIGINT
    NOT
    NULL
    AUTO_INCREMENT,
    name
    VARCHAR
(
    255
) NOT NULL,
    total_credits_required INT,
    department_id BIGINT,
    PRIMARY KEY
(
    id
),
    UNIQUE KEY UK_major_name
(
    name
),
    CONSTRAINT FK_major_department FOREIGN KEY
(
    department_id
) REFERENCES department
(
    id
)
    );

-- 3. Create Course table
CREATE TABLE IF NOT EXISTS course
(
    id
    BIGINT
    NOT
    NULL
    AUTO_INCREMENT,
    code
    VARCHAR
(
    20
) NOT NULL,
    name VARCHAR
(
    255
) NOT NULL,
    credits_theory INT,
    credits_practical INT,
    course_type VARCHAR
(
    20
),
    PRIMARY KEY
(
    id
),
    UNIQUE KEY UK_course_code
(
    code
)
    );

-- 4. Create Program Curriculum table (Course-Major relationship)
CREATE TABLE IF NOT EXISTS program_curriculum
(
    id
    BIGINT
    NOT
    NULL
    AUTO_INCREMENT,
    course_id
    BIGINT
    NOT
    NULL,
    major_id
    BIGINT
    NOT
    NULL,
    is_mandatory
    BOOLEAN,
    semester_recommended
    INT,
    PRIMARY
    KEY
(
    id
),
    UNIQUE KEY UK_program_curriculum
(
    course_id,
    major_id
),
    CONSTRAINT FK_program_curriculum_course FOREIGN KEY
(
    course_id
) REFERENCES course
(
    id
),
    CONSTRAINT FK_program_curriculum_major FOREIGN KEY
(
    major_id
) REFERENCES major
(
    id
)
    );

-- 5. Create Prerequisite Course table
CREATE TABLE IF NOT EXISTS prerequisite_course
(
    id
    BIGINT
    NOT
    NULL
    AUTO_INCREMENT,
    course_id
    BIGINT
    NOT
    NULL,
    prerequisite_course_id
    BIGINT
    NOT
    NULL,
    PRIMARY
    KEY
(
    id
),
    CONSTRAINT FK_prerequisite_course FOREIGN KEY
(
    course_id
) REFERENCES course
(
    id
),
    CONSTRAINT FK_prerequisite_prerequisite FOREIGN KEY
(
    prerequisite_course_id
) REFERENCES course
(
    id
)
    );

-- 6. Create Department Member table (Department-Teacher relationship)
CREATE TABLE IF NOT EXISTS department_member
(
    id
    BIGINT
    NOT
    NULL
    AUTO_INCREMENT,
    department_id
    BIGINT
    NOT
    NULL,
    teacher_id
    BIGINT,
    department_member_type
    VARCHAR
(
    20
),
    start_date DATETIME,
    end_date DATETIME,
    PRIMARY KEY
(
    id
),
    UNIQUE KEY UK_department_member
(
    department_id,
    teacher_id
),
    CONSTRAINT FK_department_member_department FOREIGN KEY
(
    department_id
) REFERENCES department
(
    id
)
    );

-- Insert Department data (10 records)
INSERT INTO department (name)
VALUES ('Computer Science'),
       ('Mathematics'),
       ('Physics'),
       ('Chemistry'),
       ('Biology'),
       ('Business Administration'),
       ('Economics'),
       ('Literature'),
       ('History'),
       ('Psychology') ON DUPLICATE KEY
UPDATE name =
VALUES (name);

-- Insert Major data (10 records)
INSERT INTO major (name, total_credits_required, department_id)
VALUES ('Software Engineering', 140, 1),
       ('Information Systems', 135, 1),
       ('Pure Mathematics', 130, 2),
       ('Applied Mathematics', 135, 2),
       ('Theoretical Physics', 140, 3),
       ('Applied Physics', 138, 3),
       ('Organic Chemistry', 142, 4),
       ('Biochemistry', 145, 5),
       ('Business Management', 120, 6),
       ('Financial Economics', 125, 7) ON DUPLICATE KEY
UPDATE
    total_credits_required =
VALUES (total_credits_required), department_id =
VALUES (department_id);

-- Insert Course data (10 records)
INSERT INTO course (code, name, credits_theory, credits_practical, course_type)
VALUES ('CS101', 'Introduction to Programming', 3, 1, 'SPECIALIZED'),
       ('MATH101', 'Calculus I', 4, 0, 'GENERAL'),
       ('PHYS101', 'General Physics I', 3, 1, 'GENERAL'),
       ('CHEM101', 'General Chemistry', 3, 1, 'GENERAL'),
       ('BIO101', 'Introduction to Biology', 3, 1, 'GENERAL'),
       ('BUS101', 'Principles of Management', 3, 0, 'SPECIALIZED'),
       ('ECON101', 'Microeconomics', 3, 0, 'SPECIALIZED'),
       ('ENG101', 'English Communication', 2, 1, 'GENERAL'),
       ('CS201', 'Data Structures', 3, 1, 'SPECIALIZED'),
       ('MATH201', 'Calculus II', 4, 0, 'ELECTIVE') ON DUPLICATE KEY
UPDATE
    name =
VALUES (name), credits_theory =
VALUES (credits_theory), credits_practical =
VALUES (credits_practical), course_type =
VALUES (course_type);

-- Insert Program Curriculum data (10 records - linking courses to majors)
INSERT INTO program_curriculum (course_id, major_id, is_mandatory, semester_recommended)
VALUES (1, 1, TRUE, 1),  -- CS101 for Software Engineering
       (2, 1, TRUE, 1),  -- MATH101 for Software Engineering
       (9, 1, TRUE, 3),  -- CS201 for Software Engineering
       (1, 2, TRUE, 2),  -- CS101 for Information Systems
       (2, 3, TRUE, 1),  -- MATH101 for Pure Mathematics
       (10, 3, TRUE, 2), -- MATH201 for Pure Mathematics
       (3, 5, TRUE, 1),  -- PHYS101 for Theoretical Physics
       (4, 7, TRUE, 1),  -- CHEM101 for Organic Chemistry
       (6, 9, TRUE, 1),  -- BUS101 for Business Management
       (7, 10, TRUE, 2)  -- ECON101 for Financial Economics
    ON DUPLICATE KEY
UPDATE
    is_mandatory =
VALUES (is_mandatory), semester_recommended =
VALUES (semester_recommended);

-- Insert Prerequisite Course data (10 records - course dependencies)
INSERT INTO prerequisite_course (course_id, prerequisite_course_id)
VALUES (9, 1),  -- CS201 requires CS101
       (10, 2), -- MATH201 requires MATH101
       (9, 2),  -- CS201 requires MATH101
       (1, 8),  -- CS101 requires ENG101
       (2, 8),  -- MATH101 requires ENG101
       (3, 2),  -- PHYS101 requires MATH101
       (4, 2),  -- CHEM101 requires MATH101
       (5, 4),  -- BIO101 requires CHEM101
       (6, 8),  -- BUS101 requires ENG101
       (7, 2)   -- ECON101 requires MATH101
    ON DUPLICATE KEY
UPDATE
    prerequisite_course_id =
VALUES (prerequisite_course_id);

-- Insert Department Member data (10 records - linking teachers to departments)
-- Using teacher IDs from user-service (2, 73-81)
INSERT INTO department_member (department_id, teacher_id, department_member_type, start_date)
VALUES (1, 2, 'FACULTY_HEAD', '2020-01-01 00:00:00'),  -- Teacher 1 heads CS
       (1, 73, 'TEACHER', '2021-03-15 00:00:00'),      -- Teacher 2 in CS
       (2, 74, 'FACULTY_HEAD', '2019-08-01 00:00:00'), -- Teacher 3 heads Math
       (2, 75, 'TEACHER', '2022-01-10 00:00:00'),      -- Teacher 4 in Math
       (3, 76, 'TEACHER', '2020-09-01 00:00:00'),      -- Teacher 5 in Physics
       (4, 77, 'TEACHER', '2021-06-01 00:00:00'),      -- Teacher 6 in Chemistry
       (5, 78, 'FACULTY_HEAD', '2018-02-01 00:00:00'), -- Teacher 7 heads Biology
       (6, 79, 'TEACHER', '2020-12-01 00:00:00'),      -- Teacher 8 in Business
       (7, 80, 'TEACHER', '2021-04-15 00:00:00'),      -- Teacher 9 in Economics
       (8, 81, 'TEACHER', '2019-11-01 00:00:00')       -- Teacher 10 in Literature
    ON DUPLICATE KEY
UPDATE
    department_member_type =
VALUES (department_member_type), start_date =
VALUES (start_date);