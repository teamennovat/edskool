-- Recreate the unique constraint with proper error handling
DROP TRIGGER IF EXISTS check_duplicate_course_link ON courses;
DROP FUNCTION IF EXISTS prevent_duplicate_course_links();
DROP INDEX IF EXISTS idx_courses_link;

-- First ensure any duplicates are removed
WITH duplicate_links AS (
    SELECT link, 
           id,
           ROW_NUMBER() OVER (PARTITION BY link ORDER BY created_at) as rn
    FROM courses
)
DELETE FROM courses
WHERE id IN (
    SELECT id 
    FROM duplicate_links 
    WHERE rn > 1
);

-- Add unique index
CREATE UNIQUE INDEX idx_courses_link ON courses(link);

-- Add explicit constraint
ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_link_unique;
ALTER TABLE courses ADD CONSTRAINT courses_link_unique UNIQUE (link);

-- Create RLS policy for insert
DROP POLICY IF EXISTS "Users can insert courses" ON courses;
CREATE POLICY "Users can insert courses"
    ON courses
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create policy for select
DROP POLICY IF EXISTS "Users can view courses" ON courses;
CREATE POLICY "Users can view courses"
    ON courses
    FOR SELECT
    TO authenticated
    USING (true);
