-- First, remove any duplicate links that might exist
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

-- Then add the unique constraint
ALTER TABLE courses ADD CONSTRAINT unique_course_link UNIQUE (link);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create a function to check for duplicate links
CREATE OR REPLACE FUNCTION check_duplicate_course_link(course_link TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM courses 
    WHERE link = course_link
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
