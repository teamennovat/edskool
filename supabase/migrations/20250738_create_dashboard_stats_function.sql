-- Function to get dashboard statistics
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result json;
    total_course_count int;
    current_month_start timestamp;
BEGIN
    -- Set the time period for "this month" calculations
    current_month_start := date_trunc('month', current_timestamp);
    
    -- Get total course count first
    SELECT count(*) INTO total_course_count FROM courses;

    WITH monthly_stats AS (
        SELECT
            (SELECT count(*) FROM auth.users) as total_users,
            (SELECT count(*) FROM auth.users WHERE created_at >= current_month_start) as new_users_this_month,
            (SELECT count(*) FROM courses) as total_courses,
            (SELECT count(*) FROM courses WHERE created_at >= current_month_start) as new_courses_this_month,
            (SELECT count(*) FROM categories) as total_categories,
            (SELECT count(DISTINCT category_id) FROM courses WHERE category_id IS NOT NULL) as active_categories,
            (SELECT count(*) FROM courses WHERE status = 'pending') as pending_courses
    ),
    recent_activities AS (
        SELECT json_agg(
            json_build_object(
                'type', 
                CASE 
                    WHEN c.status = 'pending' THEN 'submitted'
                    WHEN c.status = 'approved' THEN 'approved'
                END,
                'name', c.name,
                'created_at', c.created_at
            )
        ) as activities
        FROM (
            SELECT status, name, created_at
            FROM courses
            ORDER BY created_at DESC
            LIMIT 5
        ) c
    ),
    category_stats AS (
        SELECT json_agg(
            json_build_object(
                'name', stats.name,
                'count', stats.course_count,
                'percentage', CASE 
                    WHEN total_course_count > 0 
                    THEN ROUND(stats.course_count::numeric * 100 / total_course_count, 1)
                    ELSE 0 
                END
            )
        ) as categories
        FROM (
            SELECT 
                c.name,
                COUNT(co.id) as course_count
            FROM categories c
            LEFT JOIN courses co ON c.id = co.category_id
            GROUP BY c.id, c.name
            ORDER BY COUNT(co.id) DESC
            LIMIT 3
        ) stats
    )
    SELECT json_build_object(
        'total_users', s.total_users,
        'new_users_this_month', s.new_users_this_month,
        'total_courses', s.total_courses,
        'new_courses_this_month', s.new_courses_this_month,
        'total_categories', s.total_categories,
        'active_categories', s.active_categories,
        'pending_courses', s.pending_courses,
        'recent_activities', COALESCE(r.activities, '[]'::json),
        'category_stats', COALESCE(c.categories, '[]'::json)
    ) INTO result
    FROM monthly_stats s
    CROSS JOIN recent_activities r
    CROSS JOIN category_stats c;

    RETURN result;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats() TO authenticated;
