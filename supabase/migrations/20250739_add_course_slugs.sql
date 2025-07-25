CREATE OR REPLACE FUNCTION generate_course_slug(course_name text, course_id uuid)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    base_slug text;
    short_id text;
BEGIN
    -- Convert name to lowercase and replace spaces/special chars with hyphens
    base_slug := lower(regexp_replace(course_name, '[^a-zA-Z0-9\s]', '', 'g'));
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    
    -- Take first 8 characters of UUID (sufficient for uniqueness)
    short_id := substring(course_id::text, 1, 8);
    
    -- Combine name and short ID
    RETURN base_slug || '-' || short_id;
END;
$$;

-- Add slug column to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE courses ADD CONSTRAINT courses_slug_key UNIQUE (slug);

-- Function to update existing courses with slugs
CREATE OR REPLACE FUNCTION update_existing_courses_slugs()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE courses
    SET slug = generate_course_slug(name, id)
    WHERE slug IS NULL;
END;
$$;

-- Create trigger function for new/updated courses
CREATE OR REPLACE FUNCTION update_course_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.slug := generate_course_slug(NEW.name, NEW.id);
    RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS set_course_slug ON courses;
CREATE TRIGGER set_course_slug
    BEFORE INSERT OR UPDATE OF name
    ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_course_slug();

-- Update existing courses
SELECT update_existing_courses_slugs();
