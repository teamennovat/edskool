-- Create a function to get pending courses with all details including submitter email
create or replace function get_pending_courses_with_details()
returns table (
    id uuid,
    created_at timestamptz,
    name text,
    description text,
    link text,
    author text,
    status text,
    submitted_by uuid,
    approved_at timestamptz,
    approved_by uuid,
    category_id uuid,
    subcategory_id uuid,
    category_name text,
    subcategory_name text,
    submitter_email text
) security definer
language sql
as $$
    SELECT 
        c.id,
        c.created_at,
        c.name,
        c.description,
        c.link,
        c.author,
        c.status,
        c.submitted_by,
        c.approved_at,
        c.approved_by,
        c.category_id,
        c.subcategory_id,
        cat.name as category_name,
        sub.name as subcategory_name,
        p.email as submitter_email
    FROM courses c
    LEFT JOIN categories cat ON c.category_id = cat.id
    LEFT JOIN subcategories sub ON c.subcategory_id = sub.id
    LEFT JOIN profiles p ON c.submitted_by = p.id
    WHERE c.status = 'pending'
    ORDER BY c.created_at DESC;
$$;
