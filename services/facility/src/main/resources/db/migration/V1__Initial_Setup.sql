-- Facility Service Database Schema
-- Creates classroom table with sample data

-- Create Classroom table
CREATE TABLE IF NOT EXISTS classroom
(
    id
    BIGINT
    NOT
    NULL
    AUTO_INCREMENT,
    room_number
    VARCHAR
(
    20
) NOT NULL,
    building VARCHAR
(
    100
),
    capacity INT,
    equipment VARCHAR
(
    500
),
    classroom_type VARCHAR
(
    20
),
    PRIMARY KEY
(
    id
),
    UNIQUE KEY UK_room_building
(
    room_number,
    building
)
    );

-- Insert sample Classroom data
INSERT INTO classroom (room_number, building, capacity, equipment, classroom_type)
VALUES
-- Main Academic Building - Lecture Halls
('A101', 'Main Academic Building', 120, NULL, 'LECTURE_HALL'),
('A102', 'Main Academic Building', 100, NULL, 'LECTURE_HALL'),
('A103', 'Main Academic Building', 80, NULL, 'LECTURE_HALL'),
('A201', 'Main Academic Building', 150, NULL, 'LECTURE_HALL'),
('A202', 'Main Academic Building', 90, NULL, 'LECTURE_HALL'),
('A203', 'Main Academic Building', 110, NULL, 'LECTURE_HALL'),
('A301', 'Main Academic Building', 200, NULL, 'LECTURE_HALL'),
('A302', 'Main Academic Building', 85, NULL, 'LECTURE_HALL'),
('A303', 'Main Academic Building', 95, NULL, 'LECTURE_HALL'),

-- Science Building - Labs
('B101', 'Science Building', 40, NULL, 'LAB'),
('B102', 'Science Building', 35, NULL, 'LAB'),
('B103', 'Science Building', 30, NULL, 'LAB'),
('B201', 'Science Building', 45, NULL, 'LAB'),
('B202', 'Science Building', 38, NULL, 'LAB'),
('B203', 'Science Building', 32, NULL, 'LAB'),
('B301', 'Science Building', 50, NULL, 'LAB'),
('B302', 'Science Building', 42, NULL, 'LAB'),

-- Engineering Building - Mixed
('C101', 'Engineering Building', 60, NULL, 'LECTURE_HALL'),
('C102', 'Engineering Building', 25, NULL, 'LAB'),
('C103', 'Engineering Building', 30, NULL, 'LAB'),
('C201', 'Engineering Building', 75, NULL, 'LECTURE_HALL'),
('C202', 'Engineering Building', 28, NULL, 'LAB'),
('C203', 'Engineering Building', 35, NULL, 'LAB'),
('C301', 'Engineering Building', 80, NULL, 'LECTURE_HALL'),

-- Business Building - Lecture Halls
('D101', 'Business Building', 90, NULL, 'LECTURE_HALL'),
('D102', 'Business Building', 70, NULL, 'LECTURE_HALL'),
('D103', 'Business Building', 85, NULL, 'LECTURE_HALL'),
('D201', 'Business Building', 100, NULL, 'LECTURE_HALL'),
('D202', 'Business Building', 65, NULL, 'LECTURE_HALL'),
('D203', 'Business Building', 75, NULL, 'LECTURE_HALL'),

-- Computer Science Building - Labs and Lecture Halls
('E101', 'Computer Science Building', 40, NULL, 'LAB'),
('E102', 'Computer Science Building', 35, NULL, 'LAB'),
('E103', 'Computer Science Building', 50, NULL, 'LAB'),
('E201', 'Computer Science Building', 60, NULL, 'LECTURE_HALL'),
('E202', 'Computer Science Building', 45, NULL, 'LAB'),
('E203', 'Computer Science Building', 55, NULL, 'LECTURE_HALL'),

-- Library Building - Study Rooms
('F101', 'Library Building', 20, NULL, 'LECTURE_HALL'),
('F102', 'Library Building', 15, NULL, 'LECTURE_HALL'),
('F103', 'Library Building', 25, NULL, 'LECTURE_HALL'),
('F201', 'Library Building', 30, NULL, 'LECTURE_HALL'),
('F202', 'Library Building', 18, NULL, 'LECTURE_HALL'),

-- Medical Building - Labs and Lecture Halls
('G101', 'Medical Building', 35, NULL, 'LAB'),
('G102', 'Medical Building', 40, NULL, 'LAB'),
('G201', 'Medical Building', 80, NULL, 'LECTURE_HALL'),
('G202', 'Medical Building', 30, NULL, 'LAB'),

-- Arts Building - Lecture Halls
('H101', 'Arts Building', 50, NULL, 'LECTURE_HALL'),
('H102', 'Arts Building', 45, NULL, 'LECTURE_HALL'),
('H201', 'Arts Building', 60, NULL, 'LECTURE_HALL'),
('H202', 'Arts Building', 40, NULL, 'LECTURE_HALL'),

-- Sports Complex - Multi-purpose
('I101', 'Sports Complex', 100, NULL, 'LECTURE_HALL'),
('I102', 'Sports Complex', 150, NULL, 'LECTURE_HALL') ON DUPLICATE KEY
UPDATE
    capacity =
VALUES (capacity), classroom_type =
VALUES (classroom_type);