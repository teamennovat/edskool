-- Enable RLS (if not already enabled)
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read reviews" ON course_reviews;
DROP POLICY IF EXISTS "Users can insert their own reviews" ON course_reviews;

-- Create policies
CREATE POLICY "Anyone can read reviews"
ON course_reviews FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Users can insert their own reviews"
ON course_reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Drop existing function
DROP FUNCTION IF EXISTS get_course_rating(uuid);

-- Create new get_course_rating function with user email
CREATE FUNCTION get_course_rating(course_id_param uuid)
RETURNS TABLE (
  id uuid,
  rating integer,
  comment text,
  created_at timestamptz,
  user_id uuid,
  user_email text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cr.id,
    cr.rating,
    cr.comment,
    cr.created_at,
    cr.user_id,
    (SELECT email FROM auth.users WHERE id = cr.user_id) as user_email
  FROM course_reviews cr
  WHERE cr.course_id = course_id_param;
END;
$$;
