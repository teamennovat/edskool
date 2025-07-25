-- Create a function to prevent duplicate links
CREATE OR REPLACE FUNCTION prevent_duplicate_course_links()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM courses 
    WHERE link = NEW.link 
    AND id != NEW.id
  ) THEN
    RAISE EXCEPTION 'duplicate_course_link'
      USING DETAIL = 'This course already exists';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS check_duplicate_course_link ON courses;

-- Create the trigger
CREATE TRIGGER check_duplicate_course_link
BEFORE INSERT OR UPDATE ON courses
FOR EACH ROW
EXECUTE FUNCTION prevent_duplicate_course_links();

-- Add unique index for better performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_courses_link ON courses (link);
