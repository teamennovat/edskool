-- Function to approve a course
create or replace function approve_course(course_id uuid)
returns void
security definer
language plpgsql
as $$
begin
  update courses
  set 
    status = 'approved',
    approved_by = auth.uid(),
    approved_at = now()
  where 
    id = course_id
    and status = 'pending';
end;
$$;
