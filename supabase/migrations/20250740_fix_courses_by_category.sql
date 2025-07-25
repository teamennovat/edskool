-- Drop all versions of the function first
DROP FUNCTION IF EXISTS get_courses_by_category(uuid);
DROP FUNCTION IF EXISTS get_courses_by_category(category_id_input uuid);
DROP FUNCTION IF EXISTS get_courses_by_category(category_id text);
DROP FUNCTION IF EXISTS get_courses_by_category(category_id_input text);
DROP FUNCTION IF EXISTS get_courses_with_ratings_by_category(uuid);
DROP FUNCTION IF EXISTS get_courses_with_ratings_by_category(category_id_input uuid);

-- Function to get courses by category with proper typing
CREATE OR REPLACE FUNCTION get_courses_with_ratings_by_category(category_id_input uuid)
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH course_ratings AS (
        SELECT 
            cr.course_id,
            COALESCE(AVG(cr.rating), 0) as avg_rating,
            COUNT(cr.id) as review_count
        FROM course_reviews cr
        GROUP BY cr.course_id
    ),
    course_list AS (
        SELECT 
            c.id,
            c.name,
            c.description,
            c.author,
            c.link,
            c.created_at,
            c.category_id,
            c.subcategory_id,
            c.status,
            c.slug,
            COALESCE(cr.avg_rating, 0) as average_rating,
            COALESCE(cr.review_count, 0) as total_reviews
        FROM courses c
        LEFT JOIN course_ratings cr ON c.id = cr.course_id
        WHERE c.category_id = category_id_input
        AND c.status = 'approved'
        ORDER BY c.created_at DESC
    )
    SELECT row_to_json(course_list)
    FROM course_list;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_courses_with_ratings_by_category(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_courses_with_ratings_by_category(uuid) TO anon;
