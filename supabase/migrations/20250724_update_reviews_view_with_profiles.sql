-- Drop the existing view if it exists
DROP VIEW IF EXISTS course_reviews_with_users;

-- Create a view that joins course_reviews with auth.users and profiles
CREATE OR REPLACE VIEW course_reviews_with_users AS
SELECT 
    cr.id,
    cr.course_id,
    cr.user_id,
    cr.rating,
    cr.comment,
    cr.created_at,
    cr.updated_at,
    au.email as user_email,
    p.full_name,
    p.avatar_url,
    (SELECT COUNT(*) FROM public.course_reviews WHERE user_id = cr.user_id) as total_reviews
FROM 
    public.course_reviews cr
    LEFT JOIN auth.users au ON cr.user_id = au.id
    LEFT JOIN public.profiles p ON cr.user_id = p.id;
