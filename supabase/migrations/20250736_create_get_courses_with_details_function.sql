-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.get_courses_with_details();

-- Create function to get courses with all details
CREATE OR REPLACE FUNCTION public.get_courses_with_details()
RETURNS SETOF RECORD
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT 
        c.id,
        c.name,
        c.description,
        c.author,
        c.link,
        c.status,
        c.created_at,
        c.category_id,
        c.subcategory_id,
        c.submitted_by,
        cat.name as category_name,
        sub.name as subcategory_name,
        au.email::text as submitter_email,
        p.full_name as submitter_full_name
    FROM courses c
    LEFT JOIN categories cat ON c.category_id = cat.id
    LEFT JOIN subcategories sub ON c.subcategory_id = sub.id
    LEFT JOIN auth.users au ON c.submitted_by = au.id
    LEFT JOIN profiles p ON au.id = p.id
    ORDER BY c.created_at DESC;
$$;

-- Specify the column types for the function
DO $$ 
BEGIN
    EXECUTE 'ALTER FUNCTION public.get_courses_with_details() SET SCHEMA public';
    EXECUTE 'ALTER FUNCTION public.get_courses_with_details() 
            RETURNS TABLE (
                id uuid,
                name text,
                description text,
                author text,
                link text,
                status text,
                created_at timestamptz,
                category_id uuid,
                subcategory_id uuid,
                submitted_by uuid,
                category_name text,
                subcategory_name text,
                submitter_email text,
                submitter_full_name text
            )';
END $$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_courses_with_details() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_courses_with_details() TO anon;
