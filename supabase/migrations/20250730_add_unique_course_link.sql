-- Add unique constraint on course link
ALTER TABLE courses ADD CONSTRAINT unique_course_link UNIQUE (link);
