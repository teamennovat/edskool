-- Function to update a course
CREATE OR REPLACE FUNCTION public.update_course(
    course_id uuid,
    course_name text,
    course_description text,
    course_author text,
    course_link text,
    course_status text,
    course_category_id uuid,
    course_subcategory_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    updated_course json;
BEGIN
    UPDATE courses
    SET 
        name = course_name,
        description = course_description,
        author = course_author,
        link = course_link,
        status = course_status,
        category_id = course_category_id,
        subcategory_id = course_subcategory_id
    WHERE id = course_id
    RETURNING json_build_object(
        'id', id,
        'name', name,
        'description', description,
        'author', author,
        'link', link,
        'status', status,
        'category_id', category_id,
        'subcategory_id', subcategory_id
    ) INTO updated_course;

    IF updated_course IS NULL THEN
        RAISE EXCEPTION 'Course not found';
    END IF;

    RETURN updated_course;
END;
$$;

-- Function to delete a course
CREATE OR REPLACE FUNCTION public.delete_course(course_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    rows_deleted int;
BEGIN
    WITH deleted AS (
        DELETE FROM courses
        WHERE id = course_id
        RETURNING id
    )
    SELECT COUNT(*) INTO rows_deleted FROM deleted;
    
    RETURN rows_deleted > 0;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.update_course TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_course TO authenticated;
