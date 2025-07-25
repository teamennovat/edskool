-- Drop existing functions
DROP FUNCTION IF EXISTS public.get_course_rating(uuid);
DROP FUNCTION IF EXISTS public.get_course_rating(course_id_input uuid);

-- Create the course rating function with correct parameter name
CREATE OR REPLACE FUNCTION public.get_course_rating(course_id_input UUID)
RETURNS TABLE (
    average_rating NUMERIC,
    total_reviews BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(ROUND(AVG(rating)::NUMERIC, 1), 0.0) as average_rating,
        COUNT(*)::BIGINT as total_reviews
    FROM course_reviews
    WHERE course_id = course_id_input;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_course_rating(course_id_input UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_course_rating(course_id_input UUID) TO anon;
