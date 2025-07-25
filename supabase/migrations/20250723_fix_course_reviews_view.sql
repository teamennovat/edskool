-- Create a view that joins course_reviews with auth.users
CREATE OR REPLACE VIEW course_reviews_with_users AS
SELECT 
    cr.id,
    cr.course_id,
    cr.user_id,
    cr.rating,
    cr.comment,
    cr.created_at,
    cr.updated_at,
    au.email as user_email
FROM 
    public.course_reviews cr
    LEFT JOIN auth.users au ON cr.user_id = au.id;

-- Drop existing function if exists
DROP FUNCTION IF EXISTS get_course_rating(uuid);

-- Create new function that uses the view
CREATE FUNCTION get_course_rating(course_id_param uuid)
RETURNS TABLE (
    id uuid,
    rating integer,
    comment text,
    created_at timestamptz,
    user_id uuid,
    user_email text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        id,
        rating,
        comment,
        created_at,
        user_id,
        user_email
    FROM course_reviews_with_users
    WHERE course_id = course_id_param;
$$;
