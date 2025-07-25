-- Drop existing view and function if they exist
DROP VIEW IF EXISTS public.course_reviews_with_users;
DROP FUNCTION IF EXISTS get_course_reviews_with_users();

-- Create a function that will be used by the view
CREATE OR REPLACE FUNCTION public.get_course_reviews_with_users()
RETURNS TABLE (
    id uuid,
    course_id uuid,
    user_id uuid,
    rating integer,
    comment text,
    created_at timestamptz,
    updated_at timestamptz,
    full_name text,
    avatar_url text,
    total_reviews bigint
) 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cr.id,
        cr.course_id,
        cr.user_id,
        cr.rating,
        cr.comment,
        cr.created_at,
        cr.updated_at,
        p.full_name,
        p.avatar_url,
        (SELECT COUNT(*) FROM public.course_reviews cr2 WHERE cr2.user_id = cr.user_id)::bigint as total_reviews
    FROM 
        public.course_reviews cr
        LEFT JOIN public.profiles p ON cr.user_id = p.id
    ORDER BY cr.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create the view that uses the security definer function with security_invoker
CREATE OR REPLACE VIEW public.course_reviews_with_users 
WITH (security_invoker = on) 
AS
    SELECT 
        id,
        course_id,
        user_id,
        rating,
        comment,
        created_at,
        updated_at,
        full_name,
        avatar_url,
        total_reviews
    FROM get_course_reviews_with_users();
