-- Migration to move birthDate field from student table to user table
-- This migration safely transfers existing birthDate data from student to user table

-- Step 1: Add birthDate column to user table
ALTER TABLE user ADD COLUMN birth_date DATE;

-- Step 2: Copy existing birthDate data from student table to user table
-- This joins student records with their corresponding user records
UPDATE user u
INNER JOIN student s ON u.id = s.user_id
SET u.birth_date = s.birth_date
WHERE s.birth_date IS NOT NULL;

-- Step 3: Remove birthDate column from student table
-- Note: This is a destructive operation, but data has been preserved in user table
ALTER TABLE student DROP COLUMN birth_date;
