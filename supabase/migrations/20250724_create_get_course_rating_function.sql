-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS get_course_rating(uuid);

-- Function to get course rating
CREATE OR REPLACE FUNCTION get_course_rating(course_id UUID)
RETURNS TABLE (
  average_rating DECIMAL,
  total_reviews INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(AVG(rating::DECIMAL), 0.0) as average_rating,
    COUNT(*)::INTEGER as total_reviews
  FROM course_reviews
  WHERE course_reviews.course_id = $1;
END;
$$ LANGUAGE plpgsql;
